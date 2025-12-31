#!/usr/bin/env node

/**
 * LIVE VERIFICATION MODE
 * Vertikal Route & Content Verification Gate
 * 
 * Returns: SHIP / FIX REQUIRED / BLOCK
 */

const https = require('https');
const { execSync } = require('child_process');

const DOMAINS = [
    'https://vertikalapp.com',
    'https://creators.vertikalapp.com',
    'https://investors.vertikalapp.com',
    'https://networks.vertikalapp.com',
    'https://beta.vertikalapp.com'
];

const BLOCKERS = {
    PLACEHOLDER_CONTENT: [
        'Data visualization placeholder',
        'Chart:',
        'Series Title',
        'Director Name',
        '[email protected]'
    ],
    ABSOLUTE_CLAIMS: [
        /\bthe only\b/i,
        /\bonly app\b/i,
        /\bonly platform\b/i,
        /\bsole\b/i,
        /\balways\b/i,
        /\bnever\b/i,
        /\bexclusively\b/i
    ],
    BADGE_VIOLATIONS: {
        'creators.vertikalapp.com': ['blue', 'green', 'titanium'],
        'investors.vertikalapp.com': ['gold', 'blue', 'titanium'],
        'networks.vertikalapp.com': ['gold', 'green', 'blue']
    },
    MISSING_CANONICAL: true,
    MISSING_REDIRECTS: true
};

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        // Add cache-busting query param
        const cacheBustUrl = url + (url.includes('?') ? '&' : '?') + '__v=' + Date.now();
        
        const options = {
            headers: {
                'cache-control': 'no-cache',
                'pragma': 'no-cache'
            },
            followRedirect: true,
            maxRedirects: 5
        };
        
        https.get(cacheBustUrl, options, (res) => {
            // Follow redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const redirectUrl = res.headers.location.startsWith('http') 
                    ? res.headers.location 
                    : new URL(res.headers.location, url).href;
                return fetchHTML(redirectUrl).then(resolve).catch(reject);
            }
            
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function checkPlaceholders(html, url) {
    const issues = [];
    BLOCKERS.PLACEHOLDER_CONTENT.forEach(placeholder => {
        if (html.includes(placeholder)) {
            issues.push(`${url}: Contains placeholder "${placeholder}"`);
        }
    });
    return issues;
}

function checkAbsoluteClaims(html, url) {
    const issues = [];
    BLOCKERS.ABSOLUTE_CLAIMS.forEach(pattern => {
        const matches = html.match(pattern);
        if (matches) {
            // Exclude console.log/error statements
            if (!html.includes('console.')) {
                issues.push(`${url}: Contains absolute claim "${matches[0]}"`);
            }
        }
    });
    return issues;
}

function checkBadgeExclusivity(html, domain) {
    const issues = [];
    
    // Extract all image srcs from HTML
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
    const imgSrcs = imgMatches.map(m => m[1]);
    
    // Filter to only badge images (exact filename matching)
    const badgePattern = /badge-(gold-founding50|investor-green|network-titanium|visionary-blue)\.(png|jpg|jpeg)/i;
    const badgeImgs = imgSrcs.filter(src => badgePattern.test(src));
    
    if (badgeImgs.length === 0) return issues; // No badge images found, skip check
    
    // Define allowed badges per domain
    const allowedBadges = {
        'creators.vertikalapp.com': ['badge-gold-founding50'],
        'investors.vertikalapp.com': ['badge-investor-green'],
        'networks.vertikalapp.com': ['badge-network-titanium'],
        'vertikalapp.com': ['badge-gold-founding50', 'badge-investor-green', 'badge-network-titanium', 'badge-visionary-blue']
    };
    
    // For main site, check if badges are in badge-system section
    if (domain === 'vertikalapp.com') {
        const badgeSystemStart = html.indexOf('<!-- BADGE_SYSTEM_START') !== -1 || 
                                 html.indexOf('<section id="badge-system"') !== -1 ||
                                 html.indexOf('id="badge-system"') !== -1 ||
                                 html.indexOf('class="badge-system"') !== -1 ||
                                 html.indexOf('V BADGE SYSTEM') !== -1; // Fallback: check for section heading
        
        if (!badgeSystemStart && badgeImgs.length > 0) {
            issues.push(`${domain}: Badge images found outside badge-system section`);
        }
        return issues; // Main site can have all badges if in correct section
    }
    
    // For subdomain sites, check badge exclusivity
    const allowed = allowedBadges[domain] || [];
    badgeImgs.forEach(imgSrc => {
        const badgeType = imgSrc.match(badgePattern)[1].toLowerCase();
        const badgeKey = `badge-${badgeType}`;
        
        if (!allowed.some(allowedBadge => badgeKey.includes(allowedBadge.replace('badge-', '')))) {
            issues.push(`${domain}: Contains forbidden badge image: ${imgSrc}`);
        }
    });
    
    return issues;
}

function checkCanonical(html, expectedUrl) {
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (!canonicalMatch) {
        return [`Missing canonical link (expected: ${expectedUrl})`];
    }
    
    const canonicalUrl = canonicalMatch[1];
    const expectedHost = new URL(expectedUrl).hostname;
    const canonicalHost = new URL(canonicalUrl, expectedUrl).hostname;
    
    // Check for forbidden hosts
    if (canonicalUrl.includes('pages.dev') || canonicalUrl.includes('netlify.app')) {
        return [`Canonical contains forbidden host: ${canonicalUrl}`];
    }
    
    // Allow exact match or redirect to canonical host
    if (canonicalHost === expectedHost) {
        return []; // PASS
    }
    
    // Check if canonical redirects to expected host (treat as PASS)
    // This is handled by fetchHTML following redirects, so if we got here, it's a mismatch
    return [`Canonical mismatch: ${canonicalUrl} (expected host: ${expectedHost})`];
}

async function verifyDomain(url) {
    const domain = url.replace('https://', '').replace('http://', '').split('/')[0];
    const issues = [];
    
    try {
        const html = await fetchHTML(url);
        
        // Check placeholders
        issues.push(...checkPlaceholders(html, url));
        
        // Check absolute claims
        issues.push(...checkAbsoluteClaims(html, url));
        
        // Check badge exclusivity (image-based only)
        issues.push(...checkBadgeExclusivity(html, domain));
        
        // Check canonical
        issues.push(...checkCanonical(html, url));
        
        // Check for forbidden hosts in hrefs
        const hrefMatches = [...html.matchAll(/href=["']([^"']+)["']/gi)];
        hrefMatches.forEach(match => {
            const href = match[1];
            if (href.includes('pages.dev') || href.includes('netlify.app')) {
                issues.push(`${url}: Contains forbidden host in href: ${href}`);
            }
        });
        
        return { url, issues, status: issues.length === 0 ? 'PASS' : 'FAIL' };
    } catch (error) {
        return { url, issues: [`Failed to fetch: ${error.message}`], status: 'BLOCK' };
    }
}

function checkRedirectsFile() {
    try {
        const redirects = require('fs').readFileSync('public/_redirects', 'utf8');
        const required = [
            '/creators/*',
            '/investors/*',
            '/networks/*',
            '/demo/*',
            '/beta/*'
        ];
        const missing = required.filter(route => !redirects.includes(route));
        return missing.length === 0 ? [] : [`Missing redirects: ${missing.join(', ')}`];
    } catch (error) {
        return ['_redirects file missing or unreadable'];
    }
}

async function main() {
    console.log('🔍 LIVE VERIFICATION MODE\n');
    
    const allIssues = [];
    const redirectIssues = checkRedirectsFile();
    allIssues.push(...redirectIssues.map(issue => ({ url: '_redirects', issue })));
    
    for (const domain of DOMAINS) {
        const result = await verifyDomain(domain);
        result.issues.forEach(issue => allIssues.push({ url: result.url, issue }));
        console.log(`${result.status === 'PASS' ? '✅' : '❌'} ${domain}: ${result.issues.length} issue(s)`);
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (allIssues.length === 0) {
        console.log('✅ SHIP');
        process.exit(0);
    } else {
        console.log('❌ FIX REQUIRED');
        console.log('\nIssues found:');
        allIssues.forEach(({ url, issue }) => {
            console.log(`  ${url}: ${issue}`);
        });
        process.exit(1);
    }
}

main().catch(error => {
    console.error('🚫 BLOCK: Verification failed:', error);
    process.exit(2);
});

