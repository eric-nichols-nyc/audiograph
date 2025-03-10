
import { ArtistSelect } from "./artist-select";


export function CompareContainer() {
    return (
        <div className="flex gap-4 border border-white/10 rounded-lg p-4 bg-card">
            <ArtistSelect />
            <ArtistSelect />
        </div>
    )
}