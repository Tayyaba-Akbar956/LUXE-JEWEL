/**
 * Environment Variables Checker
 * Run: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Environment Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log('📁 File Check:');
console.log(`   .env.local ${envExists ? '✅ Found' : '❌ NOT FOUND'}`);

if (!envExists) {
    console.log('\n❌ ERROR: .env.local file not found!');
    console.log('\nPlease create a .env.local file in your project root with:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...');
    console.log('   GOOGLE_API_KEY=AIzaSy...');
    process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
            envVars[key.trim()] = value;
        }
    }
});

console.log('\n🔑 Environment Variables:');

const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_API_KEY'
];

const optionalVars = [
    'OPENROUTER_API_KEY'
];

let allPresent = true;

requiredVars.forEach(varName => {
    const exists = !!envVars[varName];
    const value = envVars[varName];
    const preview = exists && value ? `${value.substring(0, 20)}...` : 'NOT SET';

    console.log(`   ${exists ? '✅' : '❌'} ${varName}: ${preview}`);

    if (!exists) {
        allPresent = false;
    }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
    const exists = !!envVars[varName];
    console.log(`   ${exists ? '✅' : '⚪'} ${varName}: ${exists ? 'Set' : 'Not set (optional)'}`);
});

console.log('\n' + '='.repeat(60));

if (allPresent) {
    console.log('✅ All required environment variables are set!');
    console.log('\nYou can now run:');
    console.log('   npm run generate-embeddings');
} else {
    console.log('❌ Some required environment variables are missing!');
    console.log('\nPlease add the missing variables to .env.local');
    console.log('\nWhere to find these:');
    console.log('   Supabase Keys: https://supabase.com/dashboard → Your Project → Settings → API');
    console.log('   Google AI Key: https://aistudio.google.com/app/apikey');
    process.exit(1);
}

console.log('='.repeat(60));
