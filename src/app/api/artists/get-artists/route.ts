import { NextResponse } from "next/server";
import { getArtists } from "@/actions/artists/artist";


export const GET = async () => {
    // return artists from the action in a try catch
    try {
        const artists = await getArtists();
        return NextResponse.json(artists);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error fetching artists" }, { status: 500 });
    }
}