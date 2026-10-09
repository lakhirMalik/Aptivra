import { Breadcrumbs } from '@/components/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-1 data-[orientation=vertical]:h-4"
                />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
