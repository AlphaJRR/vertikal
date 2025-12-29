/**
 * Concierge Seeding Script (Simplified)
 * 
 * GEMI — CTO of Data & Logic
 * 
 * Purpose: Batch insert the Founding 50 videos using JIM's simplified CSV format
 * Maps simple CSV structure to Prisma Show → Season → Episode hierarchy
 * 
 * Usage:
 *   npx tsx scripts/concierge-seed-simple.ts
 * 
 * Requirements:
 *   - DATABASE_URL set in .env
 *   - seed_videos_simple.csv in scripts/ directory
 *   - Prisma schema synced
 */

import { PrismaClient } from '../backend/node_modules/@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const prisma = new PrismaClient();

interface SimpleVideoRow {
  video_id: string;
  creator_id: string;
  title: string;
  description: string;
  tags: string;
  url: string;
  thumbnail_url: string;
  founding_50: string;
  created_at: string;
}

async function main() {
  console.log('🟩 GEMI — Concierge Seeding Protocol (Simplified)');
  console.log('==================================================\n');

  // Step 1: Read CSV
  // Support running from root or backend directory
  let csvPath = path.join(process.cwd(), 'scripts', 'seed_videos_simple.csv');
  if (!fs.existsSync(csvPath)) {
    csvPath = path.join(process.cwd(), '..', 'scripts', 'seed_videos_simple.csv');
  }
  if (!fs.existsSync(csvPath)) {
    csvPath = path.join(__dirname, 'seed_videos_simple.csv');
  }
  console.log(`📖 Reading seed data from: ${csvPath}`);
  
  if (!fs.existsSync(csvPath)) {
    throw new Error(`❌ CSV file not found. Tried: ${csvPath}`);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records: SimpleVideoRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`✅ Loaded ${records.length} seed records\n`);

  // Step 2: Validate creator profiles exist
  console.log('🔍 Validating creator profiles...');
  const creatorIds = [...new Set(records.map(r => r.creator_id))];
  
  for (const creatorId of creatorIds) {
    const profile = await prisma.profile.findFirst({
      where: {
        user: {
          username: creatorId,
        },
      },
    });

    if (!profile) {
      console.warn(`⚠️  Creator profile not found: ${creatorId}`);
      console.warn(`   Creating placeholder profile...`);
      
      // Create user and profile for this creator
      const user = await prisma.user.create({
        data: {
          email: `${creatorId}@vertikal.app`,
          username: creatorId,
          passwordHash: 'PLACEHOLDER', // Should be updated later
          role: 'CREATOR',
          profile: {
            create: {
              displayName: creatorId.replace('creator', 'Creator '),
              bio: 'Founding 50 Creator',
              type: 'CREATOR',
              isFounding50: true,
            },
          },
        },
        include: { profile: true },
      });

      console.log(`   ✅ Created profile for ${creatorId}`);
    }
  }

  console.log('✅ Creator validation complete\n');

  // Step 3: Batch insert Shows and Episodes
  console.log('📦 Inserting Shows and Episodes...');
  let successCount = 0;
  let errorCount = 0;

  for (const record of records) {
    try {
      // Find creator profile
      const profile = await prisma.profile.findFirst({
        where: {
          user: {
            username: record.creator_id,
          },
        },
      });

      if (!profile) {
        throw new Error(`Creator profile not found: ${record.creator_id}`);
      }

      // Parse tags (comma-separated string to array)
      const tags = record.tags.split(',').map(t => t.trim());

      // Determine genre from tags (default to "Docu" if not clear)
      let genre = 'Docu';
      if (tags.some(t => t.includes('drama') || t.includes('story'))) genre = 'Drama';
      if (tags.some(t => t.includes('sci-fi') || t.includes('cyberpunk') || t.includes('future'))) genre = 'Sci-Fi';
      if (tags.some(t => t.includes('art') || t.includes('poetry'))) genre = 'Art';

      // Parse created_at or use current date
      const createdAt = record.created_at ? new Date(record.created_at) : new Date();

      // Create Show with Season 1 and Episode 1
      const show = await prisma.show.create({
        data: {
          creatorId: profile.id,
          title: record.title,
          description: record.description,
          coverImage: record.thumbnail_url, // Use thumbnail as cover
          trailerUrl: record.url, // Use video URL as trailer
          genre: genre,
          tags: tags,
          releaseDate: createdAt,
          isPremium: false, // Default to free
          seasons: {
            create: {
              number: 1,
              title: 'Season 1',
              episodes: {
                create: {
                  title: record.title, // Use show title as episode title
                  description: record.description,
                  episodeNumber: 1,
                  videoUrl: record.url,
                  thumbnailUrl: record.thumbnail_url,
                  duration: 180, // Default 3 minutes, should be updated
                  views: 0,
                  createdAt: createdAt,
                },
              },
            },
          },
        },
      });

      // Ensure creator profile has founding50 flag
      if (record.founding_50 === 'true') {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { isFounding50: true },
        });
      }

      successCount++;
      console.log(`   ✅ Created: ${show.title} (${show.id})`);
    } catch (error) {
      errorCount++;
      console.error(`   ❌ Error creating ${record.title}:`, error);
    }
  }

  console.log(`\n📊 Seeding Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${records.length}`);

  // Step 4: Verify row count
  console.log('\n🔍 Verifying database state...');
  const showCount = await prisma.show.count();
  const episodeCount = await prisma.episode.count();
  const founding50Count = await prisma.profile.count({
    where: { isFounding50: true },
  });

  console.log(`   Shows: ${showCount}`);
  console.log(`   Episodes: ${episodeCount}`);
  console.log(`   Founding 50 Profiles: ${founding50Count}`);

  if (showCount >= records.length && episodeCount >= records.length) {
    console.log('\n✅ Content Banking Protocol: COMPLETE');
    console.log(`   All ${records.length} videos seeded successfully!`);
  } else {
    console.log('\n⚠️  Content Banking Protocol: INCOMPLETE');
    console.log(`   Expected ${records.length} shows/episodes, found ${showCount}/${episodeCount}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

