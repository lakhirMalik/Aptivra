import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Briefcase, Building2, CheckCircle2 } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type VacancyItem = {
    id: number;
    organization: string | null;
    job_family: string | null;
    job_family_slug: string | null;
    title: string | null;
    description: string | null;
    criteria_count: number;
    published_at: string | null;
};

type Family = {
    id: number;
    name: string;
    slug: string;
};

const formatDate = (iso: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : null;

export default function JobsIndex({
    vacancies,
    jobFamilies,
    selectedFamily,
}: {
    vacancies: VacancyItem[];
    jobFamilies: Family[];
    selectedFamily: string | null;
}) {
    const { auth } = usePage<{ auth: { user?: unknown } }>().props;

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6 lg:gap-8">
            <Head title="Browse Vacancies" />
            <PageHeader
                title="Browse Vacancies"
                description="Explore open roles with clear, evidence-based requirements. Compare your CV before you apply."
            />

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    asChild
                    size="sm"
                    variant={
                        selectedFamily === null || selectedFamily === ''
                            ? 'default'
                            : 'outline'
                    }
                >
                    <Link href="/jobs">All roles</Link>
                </Button>
                {jobFamilies.map((f) => (
                    <Button
                        key={f.id}
                        asChild
                        size="sm"
                        variant={
                            selectedFamily === f.slug ? 'default' : 'outline'
                        }
                    >
                        <Link href={`/jobs?family=${f.slug}`}>{f.name}</Link>
                    </Button>
                ))}
            </div>

            {vacancies.length === 0 ? (
                <Card className="shadow-xs">
                    <CardContent className="pt-6">
                        <EmptyState
                            icon={Briefcase}
                            title="No published vacancies found"
                            description={
                                auth.user
                                    ? "Approved employers will publish open positions here. Check back soon or upload your CV to start preparation."
                                    : "Approved employers will publish open positions here. Register as a candidate to prepare your CV in advance."
                            }
                            action={
                                auth.user ? (
                                    <Button asChild variant="outline">
                                        <Link href="/cv-upload">
                                            Upload your CV
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild variant="outline">
                                        <Link href="/register?type=candidate">
                                            Register as Candidate
                                        </Link>
                                    </Button>
                                )
                            }
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vacancies.map((v) => (
                        <Card
                            key={v.id}
                            className="flex flex-col justify-between shadow-xs transition-colors hover:border-primary/40"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <Badge variant="secondary">
                                        {v.job_family ?? 'General'}
                                    </Badge>
                                    {v.published_at && (
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(v.published_at)}
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="mt-2 line-clamp-1 text-lg">
                                    {v.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1.5 text-xs">
                                    <Building2
                                        className="size-3.5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {v.organization ?? 'Aptivra Employer'}
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {v.description}
                                </p>
                                <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2
                                            className="size-3.5 text-primary"
                                            aria-hidden="true"
                                        />
                                        {v.criteria_count} requirement
                                        {v.criteria_count === 1 ? '' : 's'}
                                    </span>
                                    <Button asChild size="sm" variant="ghost">
                                        <Link href={`/jobs/${v.id}`}>
                                            View details
                                            <ArrowRight
                                                className="ml-1 size-3.5"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

JobsIndex.layout = {
    breadcrumbs: [{ title: 'Browse vacancies', href: '/jobs' }],
};
