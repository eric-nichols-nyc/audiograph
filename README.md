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

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant Middleware
    participant Supabase
    
    User->>Browser: Visit protected route
    Browser->>NextJS: Request page
    NextJS->>Middleware: Process request
    Middleware->>Supabase: Check session
    
    alt No valid session
        Supabase-->>Middleware: No session
        Middleware-->>Browser: Redirect to /auth/signin
        Browser-->>User: Show login page
        User->>Browser: Login with provider
        Browser->>Supabase: Authentication request
        Supabase-->>Browser: Redirect with auth code
        Browser->>NextJS: Request /auth/callback with code
        NextJS->>Supabase: Exchange code for session
        Supabase-->>NextJS: Return session
        NextJS-->>Browser: Redirect to original route
    else Valid session
        Supabase-->>Middleware: Valid session
        Middleware-->>NextJS: Continue request
        NextJS-->>Browser: Return requested page
    end
    
    Browser-->>User: Display page content
```

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
