import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMG_HERO = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800";
const IMG_BASES = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800";

const VIPS = [
  { 
    email: 'black@vertikal.com', 
    username: 'blackawesomeness', 
    displayName: 'Black Awesomeness', 
    role: 'CREATOR' as const, 
    profileType: 'NETWORK' as const,
    isFounding50: true, 
    avatar: 'https://www.dropbox.com/scl/fi/7deqzj0fkqr4my6cgi9ik/Image-2.jpg?rlkey=szrgy5uqh14m7k8k3lvvu5fic&st=a6f8yfx0&raw=1' 
  },
  { 
    email: 'alpha@vertikal.com', 
    username: 'alphavisuals', 
    displayName: 'Alpha Visuals', 
    role: 'CREATOR' as const, 
    profileType: 'NETWORK' as const,
    isFounding50: true, 
    avatar: 'https://www.dropbox.com/scl/fi/4edlkaew0pq5xwjgc63p1/IMG_2737.JPG?rlkey=edr0wep6sp31g7k10dwoub76s&st=yhl5i0lp&raw=1' 
  },
  { 
    email: 'joshua@vertikal.com', 
    username: 'joshuaargue', 
    displayName: 'Joshua Argue', 
    role: 'CREATOR' as const, 
    profileType: 'CREATOR' as const,
    isFounding50: true, 
    avatar: 'https://www.dropbox.com/scl/fi/vaudy76mhaqtcukpkzeve/JoshuaArgue.JPG?rlkey=is2eixyxhseij6jft5k91zm9k&st=0mp4lgv9&raw=1' 
  },
  { 
    email: 'kel@vertikal.com', 
    username: 'kelmitchell', 
    displayName: 'Kel Mitchell', 
    role: 'CREATOR' as const, 
    profileType: 'CREATOR' as const,
    isFounding50: true, 
    avatar: 'https://www.dropbox.com/scl/fi/ipg6ev6ku0ylgr2jnjg46/Image.jpg?rlkey=lcebirpcgnbtlduq2zncxotfq&st=zm8l3hfq&raw=1' 
  },
  { 
    email: 'jr@vertikal.com', 
    username: 'jrroberts', 
    displayName: 'J.R.R. Roberts', 
    role: 'CREATOR' as const, 
    profileType: 'CREATOR' as const,
    isFounding50: true, 
    avatar: 'https://www.dropbox.com/scl/fi/v77iz4i895pqmlmzvqhsk/JoshuaRoberts.JPG?rlkey=4bag3kp7ud5y8w8ibi8s3lfa2&st=04hrxb2c&raw=1' 
  }
];

async function main() {
  console.log('🌱 Starting Seed...');
  
  // Seed VIPs
  for (const vip of VIPS) {
    const user = await prisma.user.upsert({
      where: { email: vip.email },
      update: {},
      create: {
        email: vip.email,
        username: vip.username,
        passwordHash: '$2a$10$dummyhash', // In production, use proper bcrypt hash
        role: vip.role,
        coinBalance: 1000,
      },
    });

    // Create or update Profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        displayName: vip.displayName,
        avatarUrl: vip.avatar,
        type: vip.profileType,
        isFounding50: vip.isFounding50,
      },
      create: {
        userId: user.id,
        displayName: vip.displayName,
        avatarUrl: vip.avatar,
        type: vip.profileType,
        isFounding50: vip.isFounding50,
        followerCount: 0,
        totalViews: 0,
      },
    });

    console.log(`Created VIP: ${vip.displayName}`);
  }
  
  // Create 195 Randoms to fill the list
  const armyPromises = Array.from({ length: 195 }).map(async (_, i) => {
    try {
      const isNetwork = i % 10 === 0;
      const username = `creator${i + 6}`;
      const email = `creator${i + 6}@test.com`;
      
      // Use upsert with username as unique identifier
      const user = await prisma.user.upsert({
        where: { username },
        update: {},
        create: {
          email,
          username,
          passwordHash: '$2a$10$dummyhash',
          role: 'CREATOR',
          coinBalance: 1000,
        },
      });

      // Use upsert for profile as well
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          displayName: `Creator ${i + 6}`,
          avatarUrl: i % 2 === 0 ? IMG_HERO : IMG_BASES,
          type: isNetwork ? 'NETWORK' : 'CREATOR',
        },
        create: {
          userId: user.id,
          displayName: `Creator ${i + 6}`,
          avatarUrl: i % 2 === 0 ? IMG_HERO : IMG_BASES,
          type: isNetwork ? 'NETWORK' : 'CREATOR',
          isFounding50: false,
          followerCount: 0,
          totalViews: 0,
        },
      });
    } catch (error: any) {
      // Skip if user already exists (unique constraint violation)
      if (error.code === 'P2002') {
        return; // User already exists, skip
      }
      throw error; // Re-throw other errors
    }
  });
  
  await Promise.all(armyPromises);
  console.log('✅ Army of 200 Created in Database.');
}

main()
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });
