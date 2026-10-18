import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    FileText,
    LogIn,
    Sparkles,
    User as UserIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Criterion = {
    text: string;
    type: 'required' | 'preferred';
};

type VacancyDetail = {
    id: number;
    organization: string | null;
    job_family: string | null;
    version: number;
    title: string;
    description: string;
    criteria: Criterion[];
    published_at: string | null;
};

const formatDate = (iso: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : null;

export default function JobShow({ vacancy }: { vacancy: VacancyDetail }) {
    const { auth } = usePage<{
        auth: { user?: { name: string; account_type?: string } };
    }>().props;
    const isGuest = !auth.user;
    const required = vacancy.criteria.filter((c) => c.type === 'required');
    const preferred = vacancy.criteria.filter((c) => c.type === 'preferred');

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-6 lg:gap-8">
            <Head title={vacancy.title} />

            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/jobs">
                        <ArrowLeft
                            className="mr-1.5 size-4"
                            aria-hidden="true"
                        />
                        Back to vacancies
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-3 border-b pb-6">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                        {vacancy.job_family ?? 'General'}
                    </Badge>
                    <Badge variant="outline">Version {vacancy.version}</Badge>
                    {vacancy.published_at && (
                        <span className="text-xs text-muted-foreground">
                            Published on {formatDate(vacancy.published_at)}
                        </span>
                    )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {vacancy.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="size-4" aria-hidden="true" />
                    <span>{vacancy.organization ?? 'Aptivra Employer'}</span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle>Role Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                                {vacancy.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle>Evidence-Based Requirements</CardTitle>
                            <CardDescription>
                                Criteria defined by the employer. In Aptivra,
                                your CV evidence is compared against these
                                points without automated rejection.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {required.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <CheckCircle2
                                            className="size-4 text-primary"
                                            aria-hidden="true"
                                        />
                                        Required Criteria ({required.length})
                                    </h3>
                                    <ul className="space-y-2">
                                        {required.map((c, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3 text-sm"
                                            >
                                                <Badge
                                                    variant="default"
                                                    className="mt-0.5 shrink-0 text-[10px]"
                                                >
                                                    Required
                                                </Badge>
                                                <span>{c.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {preferred.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <Sparkles
                                            className="size-4 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                        Preferred Criteria ({preferred.length})
                                    </h3>
                                    <ul className="space-y-2">
                                        {preferred.map((c, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2.5 rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="mt-0.5 shrink-0 text-[10px]"
                                                >
                                                    Preferred
                                                </Badge>
                                                <span className="text-foreground">
                                                    {c.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {isGuest ? (
                        <Card className="border-primary/30 shadow-xs">
                            <CardHeader>
                                <CardTitle>Apply for this Position</CardTitle>
                                <CardDescription>
                                    Sign in or create a candidate account to apply
                                    and verify your CV evidence against these
                                    criteria.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full">
                                    <Link href={login()}>
                                        <LogIn
                                            className="mr-2 size-4"
                                            aria-hidden="true"
                                        />
                                        Log in to apply
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Link href="/register?type=candidate">
                                        <UserIcon
                                            className="mr-2 size-4"
                                            aria-hidden="true"
                                        />
                                        Register as Candidate
                                    </Link>
                                </Button>
                                <p className="pt-1 text-xs text-muted-foreground">
                                    Candidate accounts are free, private, and
                                    guarantee 24-hour automatic destruction of
                                    unsubmitted CVs.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-xs">
                            <CardHeader>
                                <CardTitle>Prepare Before You Apply</CardTitle>
                                <CardDescription>
                                    Upload your CV privately to see how your
                                    demonstrated skills align with this role.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button asChild className="w-full">
                                    <Link href="/cv-upload">
                                        <FileText
                                            className="mr-2 size-4"
                                            aria-hidden="true"
                                        />
                                        Check your CV
                                    </Link>
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    Uploaded CVs are kept strictly private,
                                    scanned for safety, and automatically
                                    deleted after 24 hours unless explicitly
                                    saved.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

JobShow.layout = {
    breadcrumbs: [
        { title: 'Browse vacancies', href: '/jobs' },
        { title: 'Vacancy details', href: '#' },
    ],
};
