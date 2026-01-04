import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create verification codes
  const codes = [
    { code: 'FOUNDING_GENESIS', tier: 'master' },
    { code: 'F50-001', tier: 'founding' },
    { code: 'F50-002', tier: 'founding' },
    { code: 'F50-003', tier: 'founding' },
    { code: 'F50-004', tier: 'founding' },
    { code: 'F50-005', tier: 'founding' },
    { code: 'F50-006', tier: 'founding' },
    { code: 'F50-007', tier: 'founding' },
    { code: 'F50-008', tier: 'founding' },
    { code: 'F50-009', tier: 'founding' },
    { code: 'F50-010', tier: 'founding' },
  ];

  for (const codeData of codes) {
    await prisma.verificationCode.upsert({
      where: { code: codeData.code },
      update: {},
      create: {
        code: codeData.code,
        tier: codeData.tier,
        used: false,
      },
    });
  }

  console.log(`✅ Created ${codes.length} verification codes`);

  // Create sample creators (if they don't exist)
  const creators = [
    {
      userId: 'sample-user-1',
      name: 'J.R.R. Roberts',
      handle: 'joshuaroberts',
      avatar: 'https://www.dropbox.com/scl/fi/v77iz4i895pqmlmzvqhsk/JoshuaRoberts.JPG?rlkey=4bag3kp7ud5y8w8ibi8s3lfa2&st=04hrxb2c&raw=1',
      bio: 'Building the Vertical Film Network.',
      company: 'Vertikal',
      role: 'Founder',
      isFounding50: true,
      stats: { fans: '28k', series: '4', views: '0' },
    },
    {
      userId: 'sample-user-2',
      name: 'Joshua Argue',
      handle: 'joshuaargue',
      avatar: 'https://www.dropbox.com/scl/fi/vaudy76mhaqtcukpkzeve/JoshuaArgue.JPG?rlkey=is2eixyxhseij6jft5k91zm9k&st=0mp4lgv9&raw=1',
      bio: 'Showrunner. Creating @BestBurgers.',
      company: 'Black Awesomeness',
      role: 'Creator / Lead',
      isFounding50: true,
      stats: { fans: '42.5k', series: '8', views: '0' },
    },
  ];

  for (const creatorData of creators) {
    await prisma.creator.upsert({
      where: { handle: creatorData.handle },
      update: {},
      create: creatorData,
    });
  }

  console.log(`✅ Created ${creators.length} sample creators`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


