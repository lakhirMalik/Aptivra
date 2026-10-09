import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    Inbox,
    ShieldCheck,
} from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Org = {
    id: number;
    name: string;
    status: string;
    vacancies_count: number;
};

export default function Dashboard({
    organizations,
    pendingCount,
}: {
    organizations: Org[];
    pendingCount: number | null;
}) {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;
    const firstName = auth.user.name.split(' ')[0];

    const approved = organizations.filter((o) => o.status === 'approved');
    const totalVacancies = organizations.reduce(
        (sum, o) => sum + o.vacancies_count,
        0,
    );
    const firstApproved = approved[0];

    let next = {
        title: 'Create your employer workspace',
        text: 'Add your company to start publishing vacancies.',
        label: 'Create workspace',
        href: '/workspace',
    };

    if (organizations.length > 0 && !firstApproved) {
        next = {
            title: 'Your workspace is awaiting approval',
            text: 'An administrator reviews new workspaces. You can publish vacancies once it is approved.',
            label: 'View status',
            href: '/workspace',
        };
    } else if (firstApproved) {
        next = {
            title:
                totalVacancies === 0
                    ? 'Create your first vacancy'
                    : 'Manage your vacancies',
            text:
                totalVacancies === 0
                    ? 'Define the role and its requirements, then publish it.'
                    : 'Edit drafts and publish vacancies for your approved workspaces.',
            label: 'Open vacancies',
            href: `/organizations/${firstApproved.id}/vacancies`,
        };
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6 lg:gap-8">
            <Head title="Dashboard" />
            <PageHeader
                title={`Welcome back, ${firstName}`}
                description="A summary of your Aptivra workspaces."
            />

            <div
                className={`grid gap-4 ${pendingCount !== null ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}
            >
                <StatCard
                    label="Workspaces"
                    value={organizations.length}
                    icon={Building2}
                />
                <StatCard
                    label="Approved"
                    value={approved.length}
                    icon={ShieldCheck}
                />
                <StatCard
                    label="Vacancies"
                    value={totalVacancies}
                    icon={Briefcase}
                />
                {pendingCount !== null && (
                    <StatCard
                        label="Awaiting approval"
                        value={pendingCount}
                        hint="Platform-wide, for administrators"
                        icon={Inbox}
                    />
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                <Card className="min-w-0 shadow-xs lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Your workspaces</CardTitle>
                        <CardDescription>
                            Workspaces you belong to.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {organizations.length === 0 ? (
                            <EmptyState
                                icon={Building2}
                                title="No workspaces yet"
                                description="Create a workspace to start hiring on Aptivra."
                                action={
                                    <Button asChild>
                                        <Link href="/workspace">
                                            Create a workspace
                                        </Link>
                                    </Button>
                                }
                            />
                        ) : (
                            <ul className="space-y-3">
                                {organizations.map((o) => (
                                    <li
                                        key={o.id}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                                    >
                                        <div className="min-w-0 space-y-1.5">
                                            <p className="truncate font-medium">
                                                {o.name}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge
                                                    status={o.status}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {o.vacancies_count}{' '}
                                                    {o.vacancies_count === 1
                                                        ? 'vacancy'
                                                        : 'vacancies'}
                                                </span>
                                            </div>
                                        </div>
                                        {o.status === 'approved' && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/organizations/${o.id}/vacancies`}
                                                >
                                                    Vacancies
                                                    <ArrowRight
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            </Button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card className="h-fit shadow-xs">
                    <CardHeader>
                        <CardTitle>{next.title}</CardTitle>
                        <CardDescription>{next.text}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href={next.href}>
                                {next.label}
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
