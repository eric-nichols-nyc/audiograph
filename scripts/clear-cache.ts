import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Import after environment variables are loaded
import { clearArtistCache, clearAllArtistsCache } from './cache-utils';

async function main() {
    const command = process.argv[2];
    const artistId = process.argv[3];

    if (!command) {
        console.error('Please specify a command: clearArtist or clearAll');
        process.exit(1);
    }

    if (command === 'clearArtist' && !artistId) {
        console.error('Please provide an artist ID');
        process.exit(1);
    }

    try {
        if (command === 'clearArtist') {
            await clearArtistCache(artistId);
        } else if (command === 'clearAll') {
            await clearAllArtistsCache();
        } else {
            console.error('Unknown command. Use clearArtist or clearAll');
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Log environment variables for debugging
console.log('Redis Configuration:', {
    url: process.env.UPSTASH_REDIS_REST_URL,
    hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN
});

main(); 