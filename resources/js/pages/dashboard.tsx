import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    Clock,
    FileText,
    Inbox,
    Lock,
    Plus,
    ShieldCheck,
    Sparkles,
    UploadCloud,
} from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
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

type CvDoc = {
    id: number;
    original_name: string;
    status: string;
    failure_reason: string | null;
    expires_at: string;
};

type RecentJob = {
    id: number;
    organization: string | null;
    job_family: string | null;
    title: string | null;
    criteria_count: number;
    published_at: string | null;
};

type Family = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    accountType: 'candidate' | 'employer';
    isEmployer: boolean;
    organizations: Org[];
    pendingCount: number | null;
    cvDocument: CvDoc | null;
    recentJobs: RecentJob[];
    jobFamilies: Family[];
};

const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
    });

export default function Dashboard({
    isEmployer,
    organizations,
    pendingCount,
    cvDocument,
    recentJobs,
    jobFamilies,
}: Props) {
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
            <Head title={isEmployer ? 'Employer Dashboard' : 'Candidate Dashboard'} />

            <PageHeader
                title={`Welcome back, ${firstName}`}
                description={
                    isEmployer
                        ? 'Your employer workspace for vacancy publication and candidate reviews.'
                        : 'Your candidate workspace for private CV preparation and evidence-based jobs.'
                }
            />

            {/* CANDIDATE VIEW: Strictly rendered for candidate accounts */}
            {!isEmployer ? (
                <div className="flex flex-col gap-6 lg:gap-8">
                    {/* Candidate Top Stats */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <StatCard
                            label="CV Safety Status"
                            value={
                                cvDocument
                                    ? cvDocument.status.toUpperCase()
                                    : 'NOT UPLOADED'
                            }
                            hint={
                                cvDocument
                                    ? `Expires on ${formatDateTime(cvDocument.expires_at)}`
                                    : 'Upload a PDF or DOCX file'
                            }
                            icon={cvDocument?.status === 'clean' ? ShieldCheck : FileText}
                        />
                        <StatCard
                            label="Target Roles"
                            value={jobFamilies.length}
                            hint="Frontend, Backend, Data Analysis"
                            icon={Sparkles}
                        />
                        <StatCard
                            label="Open Vacancies"
                            value={recentJobs.length > 0 ? `${recentJobs.length} Recent` : '0 Active'}
                            hint="Evidence-based recruitment"
                            icon={Briefcase}
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                        <div className="min-w-0 space-y-6 lg:col-span-2">
                            {/* CV Management Card */}
                            <Card className="shadow-xs">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>My CV & Safety Scan</CardTitle>
                                            <CardDescription>
                                                Private to you. Evaluated without automated rejection or demographic inference.
                                            </CardDescription>
                                        </div>
                                        {cvDocument && <StatusBadge status={cvDocument.status} />}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {cvDocument ? (
                                        <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
                                                    <FileText className="size-5" aria-hidden="true" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {cvDocument.original_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Clock className="size-3.5" aria-hidden="true" />
                                                        Automatic 24h deletion: {formatDateTime(cvDocument.expires_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href="/cv-upload">
                                                    Manage CV
                                                    <ArrowRight className="size-4 ml-1.5" aria-hidden="true" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={UploadCloud}
                                            title="No CV uploaded yet"
                                            description="Upload your CV for a private safety scan and role requirement check. Files are deleted automatically after 24 hours."
                                            action={
                                                <Button asChild>
                                                    <Link href="/cv-upload">Upload your CV</Link>
                                                </Button>
                                            }
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Open Jobs */}
                            <Card className="shadow-xs">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Open Vacancies</CardTitle>
                                            <CardDescription>
                                                Roles published by approved employers on Aptivra.
                                            </CardDescription>
                                        </div>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href="/jobs">
                                                Browse all
                                                <ArrowRight className="size-4 ml-1" aria-hidden="true" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {recentJobs.length === 0 ? (
                                        <EmptyState
                                            icon={Briefcase}
                                            title="No published vacancies yet"
                                            description="Approved employers publish positions here. You can practice skills and prepare your CV in the meantime."
                                        />
                                    ) : (
                                        <ul className="space-y-3">
                                            {recentJobs.map((j) => (
                                                <li
                                                    key={j.id}
                                                    className="flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="min-w-0 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate font-medium">{j.title}</p>
                                                            <Badge variant="secondary" className="text-[10px]">
                                                                {j.job_family}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                            <Building2 className="size-3.5" aria-hidden="true" />
                                                            <span>{j.organization}</span>
                                                            <span>•</span>
                                                            <span>{j.criteria_count} requirements</span>
                                                        </p>
                                                    </div>
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/jobs/${j.id}`}>
                                                            View requirements
                                                            <ArrowRight className="size-3.5 ml-1" aria-hidden="true" />
                                                        </Link>
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            {/* Target Pathways Card */}
                            <Card className="shadow-xs">
                                <CardHeader>
                                    <CardTitle>Evaluated Role Tracks</CardTitle>
                                    <CardDescription>
                                        Curated job families supported in Aptivra FYP.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {jobFamilies.map((f) => (
                                        <Link
                                            key={f.id}
                                            href={`/jobs?family=${f.slug}`}
                                            className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                                                <span className="font-medium">{f.name}</span>
                                            </div>
                                            <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Privacy Guarantee Card */}
                            <Card className="shadow-xs">
                                <CardHeader>
                                    <CardTitle>Privacy Guarantee</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-xs text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <Lock className="size-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                            <span>Your CV and practice attempts are private and never visible to employers unless you submit an application.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Clock className="size-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                            <span>One-off preparation files are automatically destroyed 24 hours after upload.</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                /* EMPLOYER VIEW: Strictly rendered for employer accounts */
                <div className="flex flex-col gap-6 lg:gap-8">
                    {/* Employer Stats */}
                    <div
                        className={`grid gap-4 ${
                            pendingCount !== null
                                ? 'sm:grid-cols-2 lg:grid-cols-4'
                                : 'sm:grid-cols-3'
                        }`}
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
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Your Workspaces</CardTitle>
                                        <CardDescription>
                                            Organizations you belong to as owner, recruiter, or reviewer.
                                        </CardDescription>
                                    </div>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href="/workspace">
                                            <Plus className="size-4 mr-1" aria-hidden="true" />
                                            New workspace
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {organizations.length === 0 ? (
                                    <EmptyState
                                        icon={Building2}
                                        title="No workspaces yet"
                                        description="Create a workspace to start publishing vacancies on Aptivra."
                                        action={
                                            <Button asChild>
                                                <Link href="/workspace">Create a workspace</Link>
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
                                                    <p className="truncate font-medium">{o.name}</p>
                                                    <div className="flex items-center gap-3">
                                                        <StatusBadge status={o.status} />
                                                        <span className="text-sm text-muted-foreground">
                                                            {o.vacancies_count}{' '}
                                                            {o.vacancies_count === 1
                                                                ? 'vacancy'
                                                                : 'vacancies'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {o.status === 'approved' && (
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/organizations/${o.id}/vacancies`}>
                                                            Vacancies
                                                            <ArrowRight
                                                                className="size-4 ml-1"
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
                                        <ArrowRight className="size-4 ml-1.5" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
