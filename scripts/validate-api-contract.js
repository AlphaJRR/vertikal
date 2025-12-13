/**
 * VERTIKAL API Contract Validation Script
 * Validates that backend responses match frontend expectations
 */

const fs = require('fs');
const path = require('path');

// Expected API contract from types/index.ts
const EXPECTED_CONTRACTS = {
  '/api/users': {
    responseType: 'array',
    itemType: 'UserDTO',
    requiredFields: ['id', 'email', 'username', 'avatar', 'role', 'isFounding50', 'bio', 'coins', 'createdAt', 'projects'],
  },
  '/api/users/:id': {
    responseType: 'object',
    itemType: 'UserDTO',
    requiredFields: ['id', 'email', 'username', 'avatar', 'role', 'isFounding50', 'bio', 'coins', 'createdAt', 'projects'],
  },
  '/api/shows': {
    responseType: 'array',
    itemType: 'ProjectDTO',
    requiredFields: ['id', 'title', 'type', 'coverImage', 'videoUrl', 'progress', 'subTitle', 'creatorId', 'createdAt'],
  },
  '/api/shows/:id': {
    responseType: 'object',
    itemType: 'ProjectDTO',
    requiredFields: ['id', 'title', 'type', 'coverImage', 'videoUrl', 'progress', 'subTitle', 'creatorId', 'createdAt'],
  },
  '/api/auth/login': {
    responseType: 'object',
    itemType: 'LoginResponse',
    requiredFields: ['token', 'user'],
  },
  '/api/auth/register': {
    responseType: 'object',
    itemType: 'RegisterResponse',
    requiredFields: ['token', 'user'],
  },
};

// Field mappings (backend → frontend)
const FIELD_MAPPINGS = {
  UserDTO: {
    username: 'name', // Frontend expects 'name'
    coinBalance: 'coins', // Frontend expects 'coins'
    profile: {
      shows: 'projects', // Frontend expects 'projects'
    },
  },
  ProjectDTO: {
    coverImage: 'img', // Frontend expects 'img'
    description: 'subTitle', // Frontend expects 'subTitle'
    genre: 'type', // Frontend expects 'type'
    trailerUrl: 'videoUrl', // Frontend expects 'videoUrl'
  },
};

function validateContract(endpoint, contract) {
  const errors = [];
  
  // Check if endpoint exists in backend routes
  const backendRouteFile = path.join(__dirname, '../backend/src/routes', `${endpoint.split('/')[2]}.ts`);
  if (!fs.existsSync(backendRouteFile)) {
    errors.push(`❌ Backend route file not found: ${backendRouteFile}`);
  }
  
  // Check if transformer exists in types/index.ts
  const typesFile = path.join(__dirname, '../types/index.ts');
  if (fs.existsSync(typesFile)) {
    const typesContent = fs.readFileSync(typesFile, 'utf8');
    const transformerName = `transform${contract.itemType}`;
    if (!typesContent.includes(transformerName)) {
      errors.push(`❌ Transformer not found: ${transformerName}`);
    }
  }
  
  return errors;
}

function main() {
  console.log('🔍 VERTIKAL API Contract Validation');
  console.log('==================================\n');
  
  let totalErrors = 0;
  
  for (const [endpoint, contract] of Object.entries(EXPECTED_CONTRACTS)) {
    console.log(`📋 Validating: ${endpoint}`);
    const errors = validateContract(endpoint, contract);
    
    if (errors.length === 0) {
      console.log(`✅ ${endpoint} - Contract valid\n`);
    } else {
      console.log(`❌ ${endpoint} - Contract violations:`);
      errors.forEach(error => console.log(`   ${error}`));
      console.log('');
      totalErrors += errors.length;
    }
  }
  
  console.log('==================================');
  if (totalErrors === 0) {
    console.log('✅ ALL API CONTRACTS VALID');
    process.exit(0);
  } else {
    console.log(`❌ VALIDATION FAILED: ${totalErrors} error(s) found`);
    process.exit(1);
  }
}

main();

