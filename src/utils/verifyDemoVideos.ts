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
  
  DEMO_FEED.forEach((show: any) => {
    const streamUid = show.streamUid || show.cloudflare?.uid;
    const readyToStream = show.cloudflare?.readyToStream || show.readyToStream;
    const thumbnail = show.cloudflare?.thumbnail || show.thumbnail;
    const isCloudflareThumb = thumbnail?.includes('cloudflarestream.com');
    
    if (!streamUid) {
      issues.push(`❌ ${show.title}: Missing streamUid`);
    } else if (!readyToStream) {
      issues.push(`⚠️  ${show.title}: Has streamUid but readyToStream is false`);
    } else if (!isCloudflareThumb) {
      issues.push(`⚠️  ${show.title}: Not using Cloudflare thumbnail URL`);
    } else {
      valid.push(`✅ ${show.title}: streamUid=${streamUid}, readyToStream=true, Cloudflare thumbnail`);
    }
  });
  
  console.log(`\n✅ VALID (${valid.length}):`);
  valid.forEach(v => console.log(`  ${v}`));
  
  if (issues.length > 0) {
    console.log(`\n❌ ISSUES (${issues.length}):`);
    issues.forEach(i => console.log(`  ${i}`));
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  return { valid: valid.length, issues: issues.length, total: DEMO_FEED.length };
}

