const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.join(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY;

async function listModels() {
    console.log('--- AVAILABLE GEMINI MODELS ---');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error.message);
            return;
        }

        data.models.forEach((m: any) => {
            const methods = m.supportedGenerationMethods.join(', ');
            console.log(`- ${m.name} [${methods}]`);
        });
    } catch (e: any) {
        console.error('Fetch failed:', e.message);
    }
}

listModels();
