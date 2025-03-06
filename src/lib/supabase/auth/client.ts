// Import our browser client implementation
import { createBrowserSupabase } from "@/lib/supabase/client";
// Import our custom User type that defines the shape of user data we need
import { User } from "@/types/user";

/**
 * Gets the Supabase auth instance for client-side authentication
 * @returns The Supabase auth instance configured with environment variables
 */
export async function getAuth() {
    const { auth } = createBrowserSupabase();  // Use our implementation
    return auth;
}

/**
 * Fetches the currently authenticated user and maps it to our User type
 * @returns Promise resolving to User object if authenticated, null if not
 */
export async function getUser(): Promise<User | null> {
    const supabase = createBrowserSupabase();
    const auth = await getAuth();
    const {
        data: { user },
    } = await auth.getUser();

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
            email: user.email!, // Non-null assertion since we require email
            role: user.role ?? 'user' // Default to 'user' role if none set
        };
    }

    // Return the user from the accounts table
    // If accountUser has id, email, and role properties, they will override the default values
    return {
        id: user.id,
        email: user.email!, // Non-null assertion since we require email
        role: user.role ?? 'user', // Default to 'user' role if none set
        ...accountUser, // Spread the account user data to include any additional fields
    };
}
