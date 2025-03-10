import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const supabase = await createClient();

        const { slug } = await params;

        const { data: artist, error } = await supabase
            .from("artists")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) {
            return NextResponse.json(
                { error: "Artist not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(artist);
    } catch (error) {
        console.error("Error fetching artist:", error);
        return NextResponse.json(
            { error: "Failed to fetch artist" },
            { status: 500 }
        );
    }
} 