/**
 * Notion Corporate Command Center Creator
 * Joshua Roberts Ent. — Automated Setup
 * 
 * Creates:
 * - Hub page "Joshua Roberts Ent. — Corporate Command Center"
 * - Revenue Gauge database (12 months seeded)
 * - The 2026 Reaping database (7 tasks seeded)
 * - DaVinci Mastery Tracker (13 modules seeded)
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.NOTION_TOKEN) {
  console.error('❌ ERROR: NOTION_TOKEN not found in .env file');
  console.error('   Create .env file with NOTION_TOKEN=your_token');
  process.exit(1);
}

if (!process.env.PARENT_PAGE_ID) {
  console.error('❌ ERROR: PARENT_PAGE_ID not found in .env file');
  console.error('   Create .env file with PARENT_PAGE_ID=your_page_id');
  process.exit(1);
}

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARENT_PAGE_ID = process.env.PARENT_PAGE_ID;

/**
 * Create Hub Page
 */
async function createHubPage() {
  try {
    console.log('📄 Creating Hub page...');
    
    const response = await notion.pages.create({
      parent: { page_id: PARENT_PAGE_ID },
      properties: {
        title: {
          title: [
            {
              text: {
                content: 'Joshua Roberts Ent. — Corporate Command Center'
              }
            }
          ]
        }
      },
      children: [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '🎯 Mission: Centralized command center for all Joshua Roberts Ent. operations across Vertikal, BTB, and Alpha Visuals. Track revenue, manage projects, and master DaVinci Resolve.'
                }
              }
            ],
            icon: {
              emoji: '🚀'
            }
          }
        },
        {
          object: 'block',
          type: 'divider'
        }
      ]
    });

    console.log('✅ Hub page created:', response.id);
    return response.id;
  } catch (error) {
    console.error('❌ Error creating Hub page:', error.message);
    throw error;
  }
}

/**
 * Create Revenue Gauge Database
 */
async function createRevenueGaugeDatabase(parentPageId) {
  try {
    console.log('📊 Creating Revenue Gauge database...');

    const response = await notion.databases.create({
      parent: { page_id: parentPageId },
      title: [
        {
          text: {
            content: 'Revenue Gauge'
          }
        }
      ],
      properties: {
        'Month': {
          type: 'date',
          date: {}
        },
        'Revenue': {
          type: 'number',
          number: {
            format: 'dollar'
          }
        },
        'Target': {
          type: 'number',
          number: {
            format: 'dollar'
          }
        },
        'Variance': {
          type: 'formula',
          formula: {
            expression: 'prop("Revenue") - prop("Target")'
          }
        },
        'Progress %': {
          type: 'formula',
          formula: {
            expression: 'if(prop("Target") == 0, 0, prop("Revenue") / prop("Target"))'
          }
        },
        'Progress Bar': {
          type: 'formula',
          formula: {
            expression: 'if(prop("Progress %") == 0, "⚪⚪⚪⚪⚪", if(prop("Progress %") <= 0.2, "🟢⚪⚪⚪⚪", if(prop("Progress %") <= 0.4, "🟢🟢⚪⚪⚪", if(prop("Progress %") <= 0.6, "🟢🟢🟢⚪⚪", if(prop("Progress %") <= 0.8, "🟢🟢🟢🟢⚪", "🟢🟢🟢🟢🟢")))))'
          }
        }
      }
    });

    console.log('✅ Revenue Gauge database created:', response.id);
    return response.id;
  } catch (error) {
    console.error('❌ Error creating Revenue Gauge database:', error.message);
    throw error;
  }
}

/**
 * Seed Revenue Gauge (12 months)
 */
async function seedRevenueGauge(databaseId) {
  try {
    console.log('🌱 Seeding Revenue Gauge (12 months)...');

    const months = [
      '2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01',
      '2026-05-01', '2026-06-01', '2026-07-01', '2026-08-01',
      '2026-09-01', '2026-10-01', '2026-11-01', '2026-12-01'
    ];

    const promises = months.map(month => {
      return notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          'Month': {
            date: {
              start: month
            }
          },
          'Revenue': {
            number: 0
          },
          'Target': {
            number: 21000
          }
        }
      });
    });

    await Promise.all(promises);
    console.log('✅ Revenue Gauge seeded: 12 months');
  } catch (error) {
    console.error('❌ Error seeding Revenue Gauge:', error.message);
    throw error;
  }
}

/**
 * Create The 2026 Reaping Database
 */
async function create2026ReapingDatabase(parentPageId) {
  try {
    console.log('📋 Creating The 2026 Reaping database...');

    const response = await notion.databases.create({
      parent: { page_id: parentPageId },
      title: [
        {
          text: {
            content: 'The 2026 Reaping'
          }
        }
      ],
      properties: {
        'Name': {
          type: 'title',
          title: {}
        },
        'Business': {
          type: 'select',
          select: {
            options: [
              { name: 'Vertikal', color: 'purple' },
              { name: 'BTB', color: 'blue' },
              { name: 'Alpha Visuals', color: 'green' }
            ]
          }
        },
        'Priority': {
          type: 'select',
          select: {
            options: [
              { name: '🔴 Critical', color: 'red' },
              { name: '🟡 High', color: 'yellow' },
              { name: '🟢 Medium', color: 'green' }
            ]
          }
        },
        'Owner': {
          type: 'select',
          select: {
            options: [
              { name: 'Self', color: 'default' },
              { name: 'Evan', color: 'blue' },
              { name: 'Christina', color: 'pink' },
              { name: 'Walter', color: 'orange' },
              { name: 'Jarrell', color: 'green' }
            ]
          }
        },
        'Timeline': {
          type: 'date',
          date: {}
        },
        'Status': {
          type: 'select',
          select: {
            options: [
              { name: 'Backlog', color: 'gray' },
              { name: 'In Production', color: 'blue' },
              { name: 'Internal Review', color: 'yellow' },
              { name: 'Live/Delivered', color: 'green' }
            ]
          }
        },
        'Deliverable Link': {
          type: 'url',
          url: {}
        }
      }
    });

    console.log('✅ The 2026 Reaping database created:', response.id);
    return response.id;
  } catch (error) {
    console.error('❌ Error creating The 2026 Reaping database:', error.message);
    throw error;
  }
}

/**
 * Seed The 2026 Reaping (7 tasks)
 */
async function seed2026Reaping(databaseId) {
  try {
    console.log('🌱 Seeding The 2026 Reaping (7 tasks)...');

    const tasks = [
      {
        name: 'Vertikal — Jan 1 Launch Sprint Master Checklist',
        business: 'Vertikal',
        priority: '🔴 Critical',
        owner: 'Evan',
        status: 'Backlog',
        timeline: null,
        link: null
      },
      {
        name: 'Vertikal — Creator Onboarding Pipeline QA',
        business: 'Vertikal',
        priority: '🟡 High',
        owner: 'Christina',
        status: 'Backlog',
        timeline: null,
        link: null
      },
      {
        name: 'BTB — Feb High Impact Production Sessions (Tue/Thu 7–9:30)',
        business: 'BTB',
        priority: '🔴 Critical',
        owner: 'Jarrell',
        status: 'Backlog',
        timeline: { start: '2026-02-01', end: '2026-02-28' },
        link: null
      },
      {
        name: 'BTB — Coach Ang + Coach Sam Joint Session (Feb 26)',
        business: 'BTB',
        priority: '🟡 High',
        owner: 'Self',
        status: 'Backlog',
        timeline: { start: '2026-02-26', end: '2026-02-26' },
        link: null
      },
      {
        name: 'AVA — March Frankfurt Workshop (10am–5pm) Master Plan',
        business: 'Alpha Visuals',
        priority: '🔴 Critical',
        owner: 'Self',
        status: 'Backlog',
        timeline: { start: '2026-03-01', end: '2026-03-31' },
        link: null
      },
      {
        name: 'AVA — Alpha Generation Moodboard Build',
        business: 'Alpha Visuals',
        priority: '🟢 Medium',
        owner: 'Self',
        status: 'Backlog',
        timeline: null,
        link: null
      },
      {
        name: 'DaVinci — 90 Day Excellence Block (Daily 1.5h)',
        business: 'Alpha Visuals',
        priority: '🟡 High',
        owner: 'Self',
        status: 'Backlog',
        timeline: { start: '2026-01-01', end: '2026-03-31' },
        link: null
      }
    ];

    const promises = tasks.map(task => {
      const properties = {
        'Name': {
          title: [
            {
              text: {
                content: task.name
              }
            }
          ]
        },
        'Business': {
          select: {
            name: task.business
          }
        },
        'Priority': {
          select: {
            name: task.priority
          }
        },
        'Owner': {
          select: {
            name: task.owner
          }
        },
        'Status': {
          select: {
            name: task.status
          }
        }
      };

      if (task.timeline) {
        properties['Timeline'] = {
          date: {
            start: task.timeline.start,
            end: task.timeline.end || undefined
          }
        };
      }

      if (task.link) {
        properties['Deliverable Link'] = {
          url: task.link
        };
      }

      return notion.pages.create({
        parent: { database_id: databaseId },
        properties
      });
    });

    await Promise.all(promises);
    console.log('✅ The 2026 Reaping seeded: 7 tasks');
  } catch (error) {
    console.error('❌ Error seeding The 2026 Reaping:', error.message);
    throw error;
  }
}

/**
 * Create DaVinci Mastery Tracker Database
 */
async function createDaVinciMasteryDatabase(parentPageId) {
  try {
    console.log('🎬 Creating DaVinci Mastery Tracker database...');

    const response = await notion.databases.create({
      parent: { page_id: parentPageId },
      title: [
        {
          text: {
            content: 'DaVinci Mastery Tracker'
          }
        }
      ],
      properties: {
        'Module': {
          type: 'title',
          title: {}
        },
        'Duration': {
          type: 'rich_text',
          rich_text: {}
        },
        'Mastered': {
          type: 'checkbox',
          checkbox: {}
        },
        'Notes': {
          type: 'rich_text',
          rich_text: {}
        },
        'Date Completed': {
          type: 'date',
          date: {}
        }
      }
    });

    console.log('✅ DaVinci Mastery Tracker database created:', response.id);
    return response.id;
  } catch (error) {
    console.error('❌ Error creating DaVinci Mastery Tracker database:', error.message);
    throw error;
  }
}

/**
 * Seed DaVinci Mastery (13 modules)
 */
async function seedDaVinciMastery(databaseId) {
  try {
    console.log('🌱 Seeding DaVinci Mastery Tracker (13 modules)...');

    const modules = [
      { name: 'Introduction to Editing', duration: '1h 09m' },
      { name: 'Introduction to Editing (Part 2)', duration: '44m' },
      { name: 'Multicam Editing', duration: '32m' },
      { name: 'Visual Effects in the Edit Page', duration: '30m' },
      { name: 'Introduction to Color', duration: '1h 33m' },
      { name: 'Advanced Color', duration: '57m' },
      { name: 'Color Management', duration: '31m' },
      { name: 'Delivering Content', duration: '19m' },
      { name: 'Introduction to Audio', duration: '1h 28m' },
      { name: 'Introduction to Sound Design', duration: '58m' },
      { name: 'Introduction to Mixing', duration: '1h 16m' },
      { name: 'Dolby Atmos Integration', duration: '48m' },
      { name: 'Introduction to Fusion', duration: '58m' }
    ];

    const promises = modules.map(module => {
      return notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          'Module': {
            title: [
              {
                text: {
                  content: module.name
                }
              }
            ]
          },
          'Duration': {
            rich_text: [
              {
                text: {
                  content: module.duration
                }
              }
            ]
          },
          'Mastered': {
            checkbox: false
          }
        }
      });
    });

    await Promise.all(promises);
    console.log('✅ DaVinci Mastery Tracker seeded: 13 modules');
  } catch (error) {
    console.error('❌ Error seeding DaVinci Mastery Tracker:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting Notion Command Center creation...\n');

    // Create Hub page
    const hubPageId = await createHubPage();
    console.log('');

    // Create databases
    const revenueGaugeId = await createRevenueGaugeDatabase(hubPageId);
    const reapingId = await create2026ReapingDatabase(hubPageId);
    const davinciId = await createDaVinciMasteryDatabase(hubPageId);
    console.log('');

    // Seed data
    await seedRevenueGauge(revenueGaugeId);
    await seed2026Reaping(reapingId);
    await seedDaVinciMastery(davinciId);
    console.log('');

    console.log('✅ ✅ ✅ COMMAND CENTER CREATED SUCCESSFULLY ✅ ✅ ✅');
    console.log(`\n📄 Hub Page ID: ${hubPageId}`);
    console.log(`📊 Revenue Gauge ID: ${revenueGaugeId}`);
    console.log(`📋 The 2026 Reaping ID: ${reapingId}`);
    console.log(`🎬 DaVinci Mastery ID: ${davinciId}`);
    console.log('\n🎉 All databases created and seeded!');
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check .env file has NOTION_TOKEN and PARENT_PAGE_ID');
    console.error('   2. Verify integration has access to parent page');
    console.error('   3. Check integration has "Update content" capability');
    process.exit(1);
  }
}

// Run
main();

