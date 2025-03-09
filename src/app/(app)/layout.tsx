import { AdminLayout } from "@/components/features/admin-layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayout title="Artists">
            {children}
        </AdminLayout>
    );
}