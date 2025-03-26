import { del, invalidateByPattern, getCacheKey } from '../src/lib/redis';

async function clearArtistCache(artistId: string) {
    console.log(`Clearing cache for artist ${artistId}...`);
    await del(getCacheKey.artist(artistId));
    console.log('Cache cleared successfully.');
}

async function clearAllArtistsCache() {
    console.log('Clearing cache for all artists...');
    await invalidateByPattern('artist:*');
    console.log('Cache cleared successfully.');
}

// If running directly from command line
if (require.main === module) {
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

    (async () => {
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
    })();
}

export { clearArtistCache, clearAllArtistsCache }; 