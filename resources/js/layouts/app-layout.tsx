import { usePage } from '@inertiajs/react';
import { useIdleTimeout } from '@/hooks/use-idle-timeout';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import PublicLayout from '@/layouts/public-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { auth } = usePage<{ auth: { user?: unknown } }>().props;

    useIdleTimeout(Boolean(auth.user));

    if (!auth.user) {
        return (
            <PublicLayout breadcrumbs={breadcrumbs}>{children}</PublicLayout>
        );
    }

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
