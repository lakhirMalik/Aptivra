import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle2,
    Clock,
    Code2,
    Database,
    FileCheck,
    FileText,
    Globe,
    Lock,
    Shield,
    Sparkles,
    User as UserIcon,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user?: { name: string; account_type?: string; is_employer?: boolean } } }>().props;

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title="Aptivra - Career Development & Evidence-Based Recruitment" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <AppLogo />
                    </Link>

                    <nav className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/jobs">
                                <Briefcase className="mr-1.5 size-4" aria-hidden="true" />
                                Browse Jobs
                            </Link>
                        </Button>

                        {auth.user ? (
                            <Button asChild size="sm">
                                <Link href={dashboard()}>
                                    Go to Dashboard
                                    <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="relative overflow-hidden py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-semibold">
                                Final Year Project &bull; SZABIST University
                            </Badge>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                Career Development &amp; Evidence-Based Recruitment
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                Connect source-linked CV evidence, employer-defined criteria, and objective evaluation.
                                Keeping candidate claims, test assessments, and hiring decisions distinct, private, and human-controlled.
                            </p>
                        </div>

                        {/* Distinct Portals: Candidate vs Employer */}
                        <div className="mt-14 grid gap-8 md:grid-cols-2">
                            {/* Candidate Portal Card */}
                            <Card className="relative flex flex-col justify-between border-2 border-primary/20 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                                <div>
                                    <CardHeader className="pb-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                                <UserIcon className="size-6" aria-hidden="true" />
                                            </div>
                                            <Badge variant="outline" className="text-xs font-medium">
                                                For Job Seekers
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl">Candidate Workspace</CardTitle>
                                        <CardDescription className="text-base">
                                            Prepare your CV, verify requirement coverage, and explore open roles without unwanted profile exposure.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Private safety scan with automatic 24-hour document destruction.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Preparation against 3 curated tracks: Frontend, Backend, Data Analysis.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Browse open vacancies with explicit required &amp; preferred criteria.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Zero automated AI rejection: your claims are preserved accurately.</span>
                                        </div>
                                    </CardContent>
                                </div>
                                <div className="border-t p-6">
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button asChild className="flex-1">
                                            <Link href="/register?type=candidate">
                                                Register as Candidate
                                                <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link href="/jobs">
                                                <Briefcase className="mr-1.5 size-4" aria-hidden="true" />
                                                Browse Jobs
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Employer Portal Card */}
                            <Card className="relative flex flex-col justify-between border-2 border-primary/20 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                                <div>
                                    <CardHeader className="pb-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                                <Building2 className="size-6" aria-hidden="true" />
                                            </div>
                                            <Badge variant="outline" className="text-xs font-medium">
                                                For Hiring Teams
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl">Employer Workspace</CardTitle>
                                        <CardDescription className="text-base">
                                            Publish versioned vacancies and review source-linked applicant evidence under strict organizational isolation.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Versioned vacancy builder with required and preferred criteria.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Role-based organization memberships (owner, recruiter, reviewer).</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Administrative verification and multi-tenant boundary enforcement.</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <span>Append-only immutable audit trail of publishing and review events.</span>
                                        </div>
                                    </CardContent>
                                </div>
                                <div className="border-t p-6">
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button asChild className="flex-1">
                                            <Link href="/register?type=employer">
                                                Register as Employer
                                                <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link href={login()}>
                                                <Building2 className="mr-1.5 size-4" aria-hidden="true" />
                                                Employer Login
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Supported Job Tracks */}
                        <div className="mt-20">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold tracking-tight">Evaluated Job Families</h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Aptivra focuses on verified early-career competence criteria across three distinct disciplines.
                                </p>
                            </div>

                            <div className="mt-8 grid gap-6 sm:grid-cols-3">
                                <Card className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500">
                                            <Globe className="size-5" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Frontend Development</h3>
                                            <p className="text-xs text-muted-foreground">React, TypeScript, UI Components, State</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-500/10 p-2.5 text-green-500">
                                            <Code2 className="size-5" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Backend Development</h3>
                                            <p className="text-xs text-muted-foreground">APIs, Databases, Authentication, Queues</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-purple-500/10 p-2.5 text-purple-500">
                                            <Database className="size-5" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Data Analysis</h3>
                                            <p className="text-xs text-muted-foreground">Python, SQL, Cleaning, Visualization</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Trust & Architectural Guarantees */}
                        <div className="mt-16 rounded-2xl border bg-muted/30 p-8 sm:p-10">
                            <div className="grid gap-8 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <Shield className="size-5" aria-hidden="true" />
                                        <span>Controlled Document Intake</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Strict PDF magic byte validation, VBA macro rejection, ClamAV anti-malware queue, and quarantined local storage.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <Clock className="size-5" aria-hidden="true" />
                                        <span>24-Hour Expiration</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Unsubmitted preparation CVs are permanently deleted after 24 hours. No permanent retention without active applications.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <FileCheck className="size-5" aria-hidden="true" />
                                        <span>Evidence, Not Black-Boxes</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Candidate claims, test results, and reviewer notes remain distinct. Zero AI-driven automated hiring or rejection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-8 text-center text-xs text-muted-foreground">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
                    <p>
                        <strong>Aptivra</strong> &bull; Final Year Project &bull; SZABIST University Karachi Campus
                    </p>
                    <p>
                        Project Team: <strong>Vishesh</strong> (2312391) &bull; <strong>Haji Lakhir</strong> (2312436) &bull; Supervisor: <strong>Sir Asif Khalid</strong>
                    </p>
                </div>
            </footer>
        </div>
    );
}
