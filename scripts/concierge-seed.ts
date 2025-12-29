/**
 * Concierge Seeding Script
 * 
 * GEMI — CTO of Data & Logic
 * 
 * Purpose: Batch insert the Founding 50 videos into Supabase via Prisma
 * 
 * Usage:
 *   npx tsx scripts/concierge-seed.ts
 * 
 * Requirements:
 *   - DATABASE_URL set in .env
 *   - seed_videos.csv in scripts/ directory
 *   - Prisma schema synced
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface SeedVideoRow {
  show_id: string;
  creator_id: string;
  title: string;
  description: string;
  genre: string;
  tags: string;
  cover_image: string;
  trailer_url: string;
  is_premium: string;
  episode_title: string;
  episode_description: string;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: string;
  founding_50: string;
}

async function main() {
  console.log('🟩 GEMI — Concierge Seeding Protocol');
  console.log('=====================================\n');

  // Step 1: Read CSV
  const csvPath = path.join(process.cwd(), 'scripts', 'seed_videos.csv');
  console.log(`📖 Reading seed data from: ${csvPath}`);
  
  if (!fs.existsSync(csvPath)) {
    throw new Error(`❌ CSV file not found: ${csvPath}`);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records: SeedVideoRow[] = parse(csvContent, {
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

      // Create Show
      const show = await prisma.show.create({
        data: {
          creatorId: profile.id,
          title: record.title,
          description: record.description,
          coverImage: record.cover_image,
          trailerUrl: record.trailer_url || null,
          genre: record.genre,
          tags: tags,
          releaseDate: new Date(),
          isPremium: record.is_premium === 'true',
          seasons: {
            create: {
              number: 1,
              title: 'Season 1',
              episodes: {
                create: {
                  title: record.episode_title,
                  description: record.episode_description || null,
                  episodeNumber: 1,
                  videoUrl: record.video_url,
                  thumbnailUrl: record.thumbnail_url,
                  duration: parseInt(record.duration_seconds, 10),
                  views: 0,
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

  if (showCount >= 50 && episodeCount >= 50) {
    console.log('\n✅ Content Banking Protocol: COMPLETE');
    console.log('   All 50 videos seeded successfully!');
  } else {
    console.log('\n⚠️  Content Banking Protocol: INCOMPLETE');
    console.log(`   Expected 50 shows/episodes, found ${showCount}/${episodeCount}`);
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

