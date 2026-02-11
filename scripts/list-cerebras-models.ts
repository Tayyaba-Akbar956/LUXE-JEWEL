const apiKey = 'csk-83tmxcwpvkvp6rr38tnj3vyfhfkx8m94mhvwwk2vccxycx96';

async function listCerebrasModels() {
    console.log('--- AVAILABLE CEREBRAS MODELS ---');
    try {
        const response = await fetch('https://api.cerebras.ai/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.error) {
            console.error('Error:', data.error.message);
            return;
        }
        data.data.forEach((m: any) => {
            console.log(`- ${m.id}`);
        });
    } catch (e: any) {
        console.error('Fetch failed:', e.message);
    }
}

listCerebrasModels();
