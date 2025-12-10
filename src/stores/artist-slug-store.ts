// stores/artist-store.ts
import { create } from 'zustand';
import { Artist } from '@/types/artist';
import { devtools } from 'zustand/middleware'

interface ArtistState {
    artist: Artist | null;
    isEditing: boolean;
    setArtist: (artist: Artist) => void;
    setEditing: (isEditing: boolean) => void;
    // Add other artist-related state and actions
}

export const useArtistStore = create<ArtistState>()(
    devtools((set) => ({
        artist: null,
        isEditing: false,
        setArtist: (artist) => {
            set({ artist });
        },
        setEditing: (isEditing) => set({ isEditing }),
    }))
);

// Function to initialize store with server data
export function initializeStore(artist: Artist) {
    console.log('Artist Store - Initializing with artist:', artist);
    useArtistStore.setState({ artist });
}