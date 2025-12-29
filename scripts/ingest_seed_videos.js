/**
 * Concierge Ingestion Script (Supabase Direct)
 * 
 * JIM — System Integrity Architect
 * GEMI — CTO of Data & Logic
 * 
 * Purpose: One-command batch insert of seed_videos.csv into Supabase
 * 
 * Usage:
 *   node scripts/ingest_seed_videos.js scripts/seed_videos_simple.csv
 * 
 * Requirements:
 *   - SUPABASE_URL set in environment
 *   - SUPABASE_SERVICE_KEY set in environment (Admin key for direct inserts)
 *   - csv-parse package installed
 *   - @supabase/supabase-js package installed
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

// ENV variables must be set in your environment
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing Supabase credentials.");
  console.error("   Set SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment.");
  console.error("   Or set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function ingestCSV(filePath) {
  try {
    console.log('🟩 GEMI — Concierge Ingestion Protocol');
    console.log('=====================================\n');
    
    console.log(`📖 Reading CSV from: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`✅ Loaded ${records.length} records from CSV\n`);

    // NOTE: This script assumes a 'videos' table exists in Supabase
    // If using Prisma schema (Show → Episode), use concierge-seed-simple.ts instead
    
    console.log(`📦 Preparing to insert ${records.length} records into Supabase...`);
    console.log(`   Table: videos`);
    console.log(`   URL: ${SUPABASE_URL}\n`);

    const { data, error } = await supabase
      .from('videos')
      .insert(records);

    if (error) {
      console.error("❌ Error inserting records:", error);
      console.error("\n💡 Note: If 'videos' table doesn't exist, use Prisma-based script instead:");
      console.error("   npx tsx scripts/concierge-seed-simple.ts");
      process.exit(1);
    } else {
      console.log(`\n✅ Successfully inserted ${data?.length || records.length} records into Supabase.`);
      
      // Verify row count
      const { count } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });
      
      console.log(`\n📊 Verification:`);
      console.log(`   Total rows in 'videos' table: ${count}`);
      console.log(`   Expected: ${records.length}`);
      
      if (count >= records.length) {
        console.log(`\n✅ Content Banking Protocol: COMPLETE`);
      } else {
        console.log(`\n⚠️  Content Banking Protocol: INCOMPLETE`);
        console.log(`   Expected ${records.length} rows, found ${count}`);
      }
    }
  } catch (err) {
    console.error("❌ Failed to ingest CSV:", err);
    process.exit(1);
  }
}

// Run with: node ingest_seed_videos.js seed_videos_simple.csv
const filePath = process.argv[2];
if (!filePath) {
  console.error("❌ Please provide a CSV file path.");
  console.error("   Example: node scripts/ingest_seed_videos.js scripts/seed_videos_simple.csv");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`❌ CSV file not found: ${filePath}`);
  process.exit(1);
}

ingestCSV(filePath);

