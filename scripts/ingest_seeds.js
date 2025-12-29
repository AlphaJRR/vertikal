/**
 * Seed Videos Ingestion Script (Node.js)
 * 
 * GEMI — CTO of Data & Logic
 * 
 * Purpose: Ingest seed_videos.csv into database using Prisma
 * Maps simple CSV format to Show → Season → Episode hierarchy
 * 
 * Usage:
 *   node scripts/ingest_seeds.js
 * 
 * Requirements:
 *   - DATABASE_URL set in backend/.env
 *   - seed_videos.csv in project root
 *   - Prisma schema synced
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

// Import Prisma Client from backend
const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🟩 GEMI — Seed Videos Ingestion');
  console.log('================================\n');

  // Step 1: Read CSV
  const csvPath = path.join(__dirname, '..', 'seed_videos.csv');
  console.log(`📖 Reading seed data from: ${csvPath}`);
  
  if (!fs.existsSync(csvPath)) {
    throw new Error(`❌ CSV file not found: ${csvPath}`);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  const header = lines[0].split(',');
  
  // Manual parsing to handle multi-column tags
  // Format: video_id,creator_id,title,description,tag1,tag2,tag3,url,thumbnail_url,founding_50,created_at
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(',');
    
    // Find positions: video_id(0), creator_id(1), title(2), description(3), tags(4-6), url(7), thumbnail_url(8), founding_50(9), created_at(10)
    // But URLs contain commas, so we need smarter parsing
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    // Simple CSV parser that handles URLs
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else {
        current += char;
      }
    }
    parts.push(current.trim()); // Last field
    
    // Extract fields (assuming fixed positions)
    const videoId = parts[0];
    const creatorId = parts[1];
    const title = parts[2];
    const description = parts[3];
    
    // Tags are in positions 4, 5, 6 (before first URL)
    const tags = [];
    let urlIndex = -1;
    for (let j = 4; j < parts.length; j++) {
      if (parts[j].startsWith('https://')) {
        urlIndex = j;
        break;
      }
      tags.push(parts[j]);
    }
    
    const url = urlIndex >= 0 ? parts[urlIndex] : '';
    const thumbnailUrl = urlIndex >= 0 && urlIndex + 1 < parts.length ? parts[urlIndex + 1] : '';
    const founding50 = urlIndex >= 0 && urlIndex + 2 < parts.length ? parts[urlIndex + 2] : 'false';
    const createdAt = urlIndex >= 0 && urlIndex + 3 < parts.length ? parts[urlIndex + 3] : new Date().toISOString();
    
    records.push({
      video_id: videoId,
      creator_id: creatorId,
      title: title,
      description: description,
      tags: tags.join(','),
      url: url,
      thumbnail_url: thumbnailUrl,
      founding_50: founding50,
      created_at: createdAt,
    });
  }

  console.log(`✅ Loaded ${records.length} seed records`);
  console.log(`   Sample record:`, JSON.stringify(records[0], null, 2));
  console.log('');

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
              displayName: creatorId.replace('user_', 'Creator '),
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
      if (tags.some(t => t.includes('city') || t.includes('urban'))) genre = 'Drama';
      if (tags.some(t => t.includes('nature') || t.includes('ocean'))) genre = 'Docu';
      if (tags.some(t => t.includes('portrait') || t.includes('fashion'))) genre = 'Art';

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
      console.error(`   ❌ Error creating ${record.title}:`, error.message);
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

