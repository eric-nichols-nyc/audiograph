import { createClient } from "@/lib/supabase/server";
import { User } from "@/types/user";

export async function getUser(): Promise<User | null> {
    const supabase = await createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Query the accounts table using the user ID
    const { data: accountUser, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching user from accounts table:', error);
        // Fall back to basic user info if there's an error
        return {
            id: user.id,
            email: user.email!,
            role: user.role ?? 'user',
        };
    }

    // Return the user from the accounts table
    // If accountUser has id, email, and role properties, they will override the default values
    return {
        id: user.id,
        email: user.email!,
        role: user.role ?? 'user',
        ...accountUser, // Spread the account user data to include any additional fields
    };
}
