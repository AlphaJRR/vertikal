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
        https.get(url, (res) => {
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
    const violations = BLOCKERS.BADGE_VIOLATIONS[domain];
    if (!violations) return issues;
    
    violations.forEach(badge => {
        const patterns = [
            new RegExp(`${badge}.*badge`, 'i'),
            new RegExp(`badge.*${badge}`, 'i'),
            new RegExp(`-${badge}\\.`, 'i')
        ];
        patterns.forEach(pattern => {
            if (pattern.test(html)) {
                issues.push(`${domain}: Contains forbidden ${badge} badge reference`);
            }
        });
    });
    return issues;
}

function checkCanonical(html, expectedUrl) {
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (!canonicalMatch) {
        return [`Missing canonical link (expected: ${expectedUrl})`];
    }
    if (canonicalMatch[1] !== expectedUrl) {
        return [`Canonical mismatch: ${canonicalMatch[1]} (expected: ${expectedUrl})`];
    }
    return [];
}

async function verifyDomain(url) {
    const domain = url.replace('https://', '').replace('http://', '');
    const issues = [];
    
    try {
        const html = await fetchHTML(url);
        
        // Check placeholders
        issues.push(...checkPlaceholders(html, url));
        
        // Check absolute claims
        issues.push(...checkAbsoluteClaims(html, url));
        
        // Check badge exclusivity
        issues.push(...checkBadgeExclusivity(html, domain));
        
        // Check canonical
        issues.push(...checkCanonical(html, url));
        
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

