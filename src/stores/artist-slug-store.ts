// stores/artist-store.ts
import { create } from 'zustand';
import { Artist } from '@/types';

interface ArtistState {
    artist: Artist | null;
    isEditing: boolean;
    setArtist: (artist: Artist) => void;
    setEditing: (isEditing: boolean) => void;
    // Add other artist-related state and actions
}

export const useArtistStore = create<ArtistState>((set) => ({
    artist: null,
    isEditing: false,
    setArtist: (artist) => set({ artist }),
    setEditing: (isEditing) => set({ isEditing }),
}));

// Function to initialize store with server data
export function initializeStore(artist: Artist) {
    useArtistStore.setState({ artist });
}