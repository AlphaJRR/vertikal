/**
 * Runtime verification for demo videos
 * Call this in development to verify all videos have required Cloudflare data
 */

import { DEMO_FEED } from '../data/demoSeed';

export function verifyDemoVideos() {
  if (typeof window === 'undefined') return;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 DEMO VIDEO VERIFICATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const issues: string[] = [];
  const valid: string[] = [];
  const uids: string[] = [];
  
  DEMO_FEED.forEach((show: any) => {
    const streamUid = show.streamUid || show.cloudflare?.uid;
    const readyToStream = show.cloudflare?.readyToStream || show.readyToStream;
    const thumbnail = show.cloudflare?.thumbnail || show.thumbnail;
    const isCloudflareThumb = thumbnail?.includes('cloudflarestream.com');
    
    if (!streamUid) {
      issues.push(`❌ ${show.title}: Missing streamUid`);
    } else {
      uids.push(streamUid);
      
      if (!readyToStream) {
        issues.push(`⚠️  ${show.title}: Has streamUid but readyToStream is false`);
      } else if (!isCloudflareThumb) {
        issues.push(`⚠️  ${show.title}: Not using Cloudflare thumbnail URL`);
      } else {
        valid.push(`✅ ${show.title}: streamUid=${streamUid}, readyToStream=true, Cloudflare thumbnail`);
      }
    }
  });
  
  // ✅ CRITICAL: Check for duplicate UIDs
  const uniqueUids = new Set(uids);
  const duplicates = uids.filter((uid, i) => uids.indexOf(uid) !== i);
  
  if (duplicates.length > 0) {
    const dupes = [...new Set(duplicates)];
    issues.push(`🚨 CRITICAL: DUPLICATE STREAM UIDs DETECTED: ${dupes.join(', ')}`);
    issues.push(`   All videos are using the same UID - this is WRONG!`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('🚨 BUILD FAILURE: DUPLICATE UIDs');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
  
  console.log(`\n✅ VALID (${valid.length}):`);
  valid.forEach(v => console.log(`  ${v}`));
  
  if (issues.length > 0) {
    console.log(`\n❌ ISSUES (${issues.length}):`);
    issues.forEach(i => console.log(`  ${i}`));
  }
  
  console.log(`\n📊 UID Summary: ${uniqueUids.size} unique UIDs, ${DEMO_FEED.length} videos`);
  if (uniqueUids.size < DEMO_FEED.length) {
    console.error(`🚨 WARNING: Only ${uniqueUids.size} unique UIDs for ${DEMO_FEED.length} videos!`);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // ✅ CRITICAL: Return failure if duplicates exist
  const hasFailures = issues.some(i => i.includes('DUPLICATE') || i.includes('Missing'));
  
  return { 
    valid: valid.length, 
    issues: issues.length, 
    total: DEMO_FEED.length,
    uniqueUids: uniqueUids.size,
    hasFailures,
    duplicates: duplicates.length > 0
  };
}

