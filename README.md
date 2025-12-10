This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Health Checks and Monitoring

Check the health of your services:

```bash
curl http://localhost:3000/api/health | jq
```

For detailed troubleshooting and monitoring information, see [Monitoring and Troubleshooting Guide](./docs/monitoring-and-troubleshooting.md).

**Quick checks:**

- 🔍 Health: `curl http://localhost:3000/api/health`
- 📊 GraphQL: `curl -X POST http://localhost:3000/api/graphql -H "Content-Type: application/json" -d '{"query":"{ __typename }"}'`
- 🗄️ Redis status: Check terminal for `⚠️ REDIS CONNECTION FAILED` warning boxes

The app includes graceful degradation for Redis failures - it will continue to work without caching if Redis is unavailable.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# AudioGraph

> **Note on Mermaid Charts**: This README contains Mermaid diagrams that require proper rendering support. To view these diagrams:
>
> - **GitHub**: Mermaid charts are automatically rendered when viewing the README on GitHub.
> - **VS Code**: Install the "Markdown Preview Mermaid Support" extension to view diagrams in the preview.
> - **Other Editors**: Use a Markdown editor that supports Mermaid syntax, or visit [Mermaid Live Editor](https://mermaid.live) to paste and render the diagram code.

## Project Structure

```mermaid
graph TD
    A[AudioGraph] --> B[src]
    A --> C[hooks]
    A --> D[public]

    B --> E[app]
    B --> F[components]
    B --> G[lib]

    E --> H[layout.tsx]
    E --> I[page.tsx]
    E --> J[globals.css]
    E --> K[(auth)]
    E --> L[(admin)]

    K --> M[sign-in/page.tsx]
    K --> N[sign-up/page.tsx]
    K --> O[callback/page.tsx]

    L --> P[dashboard/page.tsx]

    F --> Q[auth-header.tsx]
    F --> R[theme-toggle.tsx]
    F --> S[ui/]

    C --> T[use-auth.ts]

    G --> U[utils.ts]
```

## Authentication Flow

The authentication system in AudioGraph uses Supabase Auth with Next.js middleware for session management. The flow handles both email/password and OAuth authentication methods.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant Middleware
    participant SupabaseAuth
    participant SupabaseDB

    %% Route Protection Flow
    User->>Browser: Visit protected route
    Browser->>NextJS: Request page
    NextJS->>Middleware: Process request
    Middleware->>SupabaseAuth: Check session (updateSession)

    alt No valid session
        SupabaseAuth-->>Middleware: No session
        Middleware-->>Browser: Redirect to /sign-in
        Browser-->>User: Show login page
    else Valid session
        SupabaseAuth-->>Middleware: Valid session
        Middleware-->>NextJS: Continue request
        NextJS-->>Browser: Return requested page
        Browser-->>User: Display protected content
    end

    %% Email/Password Sign-in Flow
    User->>Browser: Enter email/password
    Browser->>NextJS: Submit credentials
    NextJS->>SupabaseAuth: signInWithPassword

    alt Authentication Success
        SupabaseAuth-->>NextJS: Session created
        NextJS-->>Browser: Redirect to /admin/dashboard
        Browser-->>User: Show dashboard
    else Authentication Failed
        SupabaseAuth-->>NextJS: Error
        NextJS-->>Browser: Show error message
        Browser-->>User: Display error
    end

    %% OAuth Sign-in Flow
    User->>Browser: Click "Sign in with Google"
    Browser->>SupabaseAuth: signInWithOAuth (Google)
    SupabaseAuth-->>Browser: Redirect to Google
    Browser-->>User: Show Google login
    User->>Browser: Authenticate with Google
    Browser->>SupabaseAuth: Return with OAuth token
    SupabaseAuth-->>NextJS: Create session
    NextJS-->>Browser: Redirect to /admin/dashboard
    Browser-->>User: Show dashboard
```

### Key Components

1. **Middleware Protection**: All routes are processed through middleware that checks for valid authentication sessions.

2. **Authentication Methods**:

   - Email/Password: Traditional form-based authentication
   - OAuth: Social login through Google

3. **Session Management**:

   - Server-side: Using Supabase SSR helpers to validate sessions
   - Client-side: Using browser cookies to maintain authentication state

4. **Redirects**:
   - Unauthenticated users attempting to access protected routes are redirected to sign-in
   - Authenticated users at the root path are redirected to the artists page
   - After successful authentication, users are redirected to the dashboard

## Component and Data Flow

```mermaid
flowchart TD
    subgraph "Client Components"
        Layout[Layout Component]
        AuthHeader[Auth Header]
        ThemeToggle[Theme Toggle]
        SignIn[Sign In Page]
        SignUp[Sign Up Page]
        Callback[Auth Callback]
        Dashboard[Dashboard Page]
    end

    subgraph "Authentication"
        useAuth[useAuth Hook]
        SupabaseClient[Supabase Client]
        Session[Auth Session]
    end

    subgraph "Server Components"
        Middleware[Next.js Middleware]
        ServerAuth[Server Auth]
    end

    Layout --> AuthHeader
    Layout --> ThemeToggle

    SignIn --> useAuth
    SignUp --> useAuth
    Dashboard --> useAuth
    Callback --> SupabaseClient

    useAuth <--> SupabaseClient
    SupabaseClient <--> Session

    Middleware <--> ServerAuth
    ServerAuth <--> SupabaseClient

    style useAuth fill:#f9f,stroke:#333,stroke-width:2px
    style SupabaseClient fill:#bbf,stroke:#333,stroke-width:2px
    style Middleware fill:#bfb,stroke:#333,stroke-width:2px
```

## APIs

```mermaid
flowchart TD
    subgraph "Server-Side"
        A[Edge Function / API Route] -->|Logs activity| B[activity_logs table]
        C[Supabase Realtime Service] -->|Broadcasts changes| D[Supabase Client]
    end

    subgraph "Client-Side"
        E[ActivityLogContent Component] -->|Initial fetch| F["/api/admin/activity-logs" API]
        F -->|Returns data| E
        D -->|Real-time updates| G[Supabase Channel]
        G -->|Notifies of new activities| H[React Query Cache]
        H -->|Updates UI| E
    end

    B -->|Triggers| C

    subgraph "User Actions"
        I[User Action] -->|Triggers| A
        J[Background Job] -->|Triggers| A
    end

    subgraph "UI Components"
        E -->|Renders in| K[MetricsAdminPage]
        K -->|Uses Suspense| L[ActivityLogSkeleton]
    end
```

## GraphQL Architecture

AudioGraph uses GraphQL for efficient data fetching, implementing a clean architecture that can be understood through a restaurant analogy:

```mermaid
graph TD
    A[Component<br>👤 THE CUSTOMER] -->|Uses| B["useQuery Hook<br>🧑‍🍳 THE WAITER"]
    B -->|Takes order from| C["query.ts files<br>📜 THE MENU"]
    B -->|Sends order through| D["ApolloProvider<br>🏠 THE RESTAURANT"]
    D -->|Manages orders with| E["Apollo Client<br>💻 MANAGEMENT SYSTEM"]
    E -->|Sends to kitchen| F["/api/graphql<br>👨‍🍳 THE KITCHEN"]
    F -->|Gets ingredients from| G["Supabase<br>🏪 THE PANTRY"]
    G -->|Returns ingredients| F
    F -->|Prepares meal| E
    E -->|Tracks order status| D
    D -->|Delivers through| B
    B -->|Serves data| A
```

### The Restaurant Analogy

1. **Customer (React Component)**

   - Places orders for data
   - Receives the prepared data when ready
   - Displays the data to the user

2. **Menu (GraphQL Queries in .ts files)**

   - Defines what data can be ordered
   - Located in `src/graphql/queries/*.ts`
   - Specifies the structure of requests

3. **Waiter (useQuery Hook)**

   - Takes orders using the menu
   - Delivers data back to the component
   - Handles loading and error states

4. **Restaurant (ApolloProvider)**

   - Set up in `src/app/providers.tsx`
   - Manages the overall data flow
   - Wraps the entire application

5. **Management System (Apollo Client)**

   - Processes all orders
   - Manages caching
   - Optimizes data fetching

6. **Kitchen (/api/graphql Endpoint)**

   - Processes GraphQL queries
   - Coordinates with the database
   - Prepares the requested data

7. **Pantry (Supabase Database)**
   - Stores all the raw data
   - Provides data when requested
   - Maintains data integrity

### Example Usage

```typescript
// 1. Define the menu item (query)
const GET_ARTIST_TRACKS = gql`
  query GetArtistTracks($id: ID!) {
    artist(id: $id) {
      topTracks {
        id
        title
      }
    }
  }
`;

// 2. Place an order (in your component)
function MusicStreaming() {
  const { data, loading, error } = useQuery(GET_ARTIST_TRACKS, {
    variables: { id: artistId }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return <div>{data.artist.topTracks.map(track => ...)}</div>;
}
```

This architecture provides:

- Efficient data fetching
- Automatic caching
- Real-time loading states
- Type-safe queries
- Optimized performance

## Artist Comparison

The application includes a feature to compare metrics between two artists using a horizontal stacked bar chart. This visualization shows the distribution of fanbases across different platforms (YouTube, Spotify, Deezer, Genius, Last.fm) for each artist.

### How it Works

1. **URL Parameters**: The comparison is triggered by URL parameters:

   ```
   /compare?type=artist&entity1=<artist1_id>&entity2=<artist2_id>
   ```

2. **Data Flow**:

   - `useCompareArtists` hook fetches metrics and names for both artists
   - Metrics are fetched using `getFormattedArtistMetrics` server action
   - Artist names are fetched using `getArtistName` server action
   - Data is transformed and displayed in a horizontal stacked bar chart

3. **Components**:
   - `HorizontalStackedBarChart`: Renders the comparison visualization
   - `useCompareArtists`: Custom hook managing data fetching and state
   - Server actions in `actions/metrics` and `actions/artists`

### Example Usage

```typescript
// In a component
const {
  artist1Metrics,
  artist2Metrics,
  artist1Name,
  artist2Name,
  loading,
  error,
} = useCompareArtists();

// The chart will automatically display:
// - Loading state while fetching data
// - Error state if something goes wrong
// - Horizontal stacked bars showing platform distribution for each artist
```
