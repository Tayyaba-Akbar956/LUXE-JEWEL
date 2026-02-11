import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config();
}

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error('❌ Missing GOOGLE_API_KEY');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('🔍 Fetching available models...');
        // Note: The JS SDK doesn't have a direct listModels method on the genAI instance in all versions, 
        // sometimes it's on the client. But we can try to hit a model or use the REST API if needed.
        // Actually, let's just try gemini-2.0-flash which is standard now.

        // Let's try to verify gemini-2.0-flash
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        console.log('✅ Model object created for gemini-2.0-flash');

        // If we want a real list, we'd use the REST API
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.models) {
            console.log('\nAll Available Models:');
            data.models
                .forEach((m: any) => {
                    console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(', ')})`);
                });
        } else {
            console.log('❌ Could not list models:', JSON.stringify(data));
        }

    } catch (err: any) {
        console.error('❌ Error:', err.message);
    }
}

listModels();
