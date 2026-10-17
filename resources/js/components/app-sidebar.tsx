import { Link, usePage } from '@inertiajs/react';
import { Briefcase, Building2, FileText, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user?: { is_employer?: boolean; account_type?: string } } }>().props;
    const isEmployer = Boolean(auth.user?.is_employer || auth.user?.account_type === 'employer');

    const mainNavItems: NavItem[] = isEmployer
        ? [
              {
                  title: 'Dashboard',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Employer workspace',
                  href: '/workspace',
                  icon: Building2,
              },
              {
                  title: 'Browse jobs',
                  href: '/jobs',
                  icon: Briefcase,
              },
          ]
        : [
              {
                  title: 'Dashboard',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'My CV & Scan',
                  href: '/cv-upload',
                  icon: FileText,
              },
              {
                  title: 'Browse jobs',
                  href: '/jobs',
                  icon: Briefcase,
              },
          ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="default"
                            className="h-10"
                            asChild
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
