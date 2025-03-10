'use client';
// app/artist/[slug]/artist-provider.tsx
import { useRef, useEffect } from 'react';
import { useArtistStore } from '@/stores/artist-slug-store';
import { Artist } from '@/types/artist';

export function ArtistProvider({
    initialArtist,
    children
}: {
    initialArtist: Artist,
    children: React.ReactNode
}) {
    const initialized = useRef(false);
    const setArtist = useArtistStore(state => state.setArtist);

    // Initialize the store with server-fetched data
    useEffect(() => {
        if (!initialized.current && initialArtist) {
            setArtist(initialArtist);
            initialized.current = true;
        }
    }, [initialArtist, setArtist]);

    return <>{children}</>;
}