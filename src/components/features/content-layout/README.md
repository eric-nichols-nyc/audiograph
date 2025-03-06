# Admin Layout Component

A custom layout component for the admin panel with a navbar, expandable sidebar, and customizable content area.

## Features

- Responsive navbar with title display
- Expandable sidebar with navigation links
- Collapsible sidebar sections using Accordion component
- Theme toggle integration
- Fully responsive design
- Icons-only mode when sidebar is collapsed
- Blue-themed sidebar background (lighter shade when expanded, darker when collapsed)
- Close button positioned on the right edge of the sidebar

## Usage

```tsx
import { AdminLayout } from "@/components/features/admin-layout";

export default function YourAdminPage() {
  return (
    <AdminLayout title="Your Page Title">
      {/* Your page content here */}
      <div>
        <h2>Content goes here</h2>
        <p>This will be displayed in the main content area.</p>
      </div>
    </AdminLayout>
  );
}
```

## Props

The `AdminLayout` component accepts the following props:

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | The title to display in the navbar |
| `children` | ReactNode | The content to display in the main area |
| `className` | string (optional) | Additional CSS classes to apply to the main content area |

## Customization

The sidebar navigation items are currently hardcoded in the `AdminSidebar` component. To customize the navigation items, you can modify the `AdminSidebar` component directly.

## Components

The admin layout consists of three main components:

1. `AdminLayout` - The main layout component that combines the navbar and sidebar
2. `AdminNavbar` - The top navigation bar with title and theme toggle
3. `AdminSidebar` - The expandable sidebar with navigation links

All components are exported from the index file for easy imports.
