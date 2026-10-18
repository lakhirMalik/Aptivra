import { Link } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import type { BreadcrumbItem } from '@/types';

export default function PublicLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* Public Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <AppLogo />
                    </Link>

                    <nav className="flex items-center gap-2 sm:gap-3">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/jobs">
                                <Briefcase className="mr-1.5 size-4" aria-hidden="true" />
                                Browse Jobs
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href={login()}>Log in</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/register?type=candidate">Register</Link>
                        </Button>
                    </nav>
                </div>

                {breadcrumbs.length > 0 && (
                    <div className="border-t bg-muted/30 px-4 py-2 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    </div>
                )}
            </header>

            {/* Content Area */}
            <main className="flex flex-1 flex-col">
                {children}
            </main>

            {/* Public Footer */}
            <footer className="border-t py-8 text-center text-xs text-muted-foreground">
                <div className="mx-auto max-w-7xl space-y-1 px-4 sm:px-6 lg:px-8">
                    <p>
                        <strong>Aptivra</strong> &bull; Final Year Project &bull; SZABIST University Karachi Campus
                    </p>
                    <p className="text-muted-foreground/80">
                        Evidence-Based Recruitment &amp; Career Preparation
                    </p>
                </div>
            </footer>
        </div>
    );
}
