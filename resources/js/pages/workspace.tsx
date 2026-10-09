import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle2,
    ClipboardCheck,
    Inbox,
    Loader2,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { send } from '@/lib/api';

type Org = {
    id: number;
    name: string;
    status: string;
    created_at: string;
    vacancies_count: number;
};
type PendingOrg = { id: number; name: string; created_at: string };

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

const focusName = () => document.getElementById('workspace-name')?.focus();

function Avatar({ name }: { name: string }) {
    return (
        <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground"
            aria-hidden="true"
        >
            {initials(name)}
        </div>
    );
}

export default function Workspace({
    organizations,
    pending,
    isAdmin,
}: {
    organizations: Org[];
    pending: PendingOrg[];
    isAdmin: boolean;
}) {
    const [name, setName] = useState('');
    const [touched, setTouched] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const trimmed = name.trim();
    const nameInvalid = touched && trimmed.length < 2;

    async function run(
        key: string,
        url: string,
        body: unknown,
        success: string,
    ): Promise<boolean> {
        setBusy(key);
        setError('');
        setNotice('');
        try {
            await send(url, 'POST', body);
            setNotice(success);
            router.reload();

            return true;
        } catch (e) {
            setError((e as Error).message);

            return false;
        } finally {
            setBusy(null);
        }
    }

    async function create(e: FormEvent) {
        e.preventDefault();
        setTouched(true);

        if (trimmed.length < 2) {
            return;
        }

        if (
            await run(
                'create',
                '/organizations',
                { name: trimmed },
                `"${trimmed}" was created and is waiting for approval.`,
            )
        ) {
            setName('');
            setTouched(false);
        }
    }

    const approved = organizations.filter((o) => o.status === 'approved');
    const awaiting = organizations.length - approved.length;
    const totalVacancies = organizations.reduce(
        (sum, o) => sum + o.vacancies_count,
        0,
    );
    const firstApproved = approved[0];

    const steps: {
        done: boolean;
        title: string;
        detail: string;
        action?: ReactNode;
    }[] = [
        {
            done: organizations.length > 0,
            title: 'Create your workspace',
            detail: 'Add your company name.',
            action: (
                <Button size="sm" variant="outline" onClick={focusName}>
                    Start
                </Button>
            ),
        },
        {
            done: approved.length > 0,
            title: 'Get approved',
            detail: 'An administrator reviews new workspaces.',
        },
        {
            done: totalVacancies > 0,
            title: 'Create your first vacancy',
            detail: 'Define the role and its requirements.',
            action: firstApproved ? (
                <Button asChild size="sm" variant="outline">
                    <Link href={`/organizations/${firstApproved.id}/vacancies`}>
                        Open
                    </Link>
                </Button>
            ) : undefined,
        },
    ];
    const completed = steps.filter((s) => s.done).length;
    const currentStep = steps.findIndex((s) => !s.done);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6 lg:gap-8">
            <Head title="Employer workspace" />
            <PageHeader
                title="Employer workspace"
                description="Create a workspace for your company, get it approved, then publish vacancies and review applicants."
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Workspaces"
                    value={organizations.length}
                    hint={
                        awaiting > 0
                            ? `${awaiting} awaiting approval`
                            : undefined
                    }
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
            </div>

            <div aria-live="polite">
                {error && (
                    <p
                        role="alert"
                        className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                    >
                        {error}
                    </p>
                )}
                {notice && (
                    <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2
                            className="size-4 shrink-0"
                            aria-hidden="true"
                        />
                        {notice}
                    </p>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                <div className="min-w-0 space-y-6 lg:col-span-2">
                    <Card className="shadow-xs">
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
                                    description="Create your first workspace to start hiring on Aptivra."
                                    action={
                                        <Button onClick={focusName}>
                                            Create a workspace
                                        </Button>
                                    }
                                />
                            ) : (
                                <ul className="space-y-3">
                                    {organizations.map((o) => (
                                        <li
                                            key={o.id}
                                            className="flex flex-col gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center"
                                        >
                                            <Avatar name={o.name} />
                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <p className="truncate font-medium">
                                                        {o.name}
                                                    </p>
                                                    <StatusBadge
                                                        status={o.status}
                                                    />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Created{' '}
                                                    {formatDate(o.created_at)} ·{' '}
                                                    {o.vacancies_count}{' '}
                                                    {o.vacancies_count === 1
                                                        ? 'vacancy'
                                                        : 'vacancies'}
                                                </p>
                                            </div>
                                            {o.status === 'approved' ? (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full sm:w-auto"
                                                >
                                                    <Link
                                                        href={`/organizations/${o.id}/vacancies`}
                                                    >
                                                        View vacancies
                                                        <ArrowRight
                                                            className="size-4"
                                                            aria-hidden="true"
                                                        />
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <p className="text-sm text-muted-foreground sm:max-w-40 sm:text-right">
                                                    Vacancies unlock after
                                                    approval.
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    {isAdmin && (
                        <Card className="shadow-xs">
                            <CardHeader>
                                <CardTitle>Approval queue</CardTitle>
                                <CardDescription>
                                    {pending.length === 0
                                        ? 'Workspaces waiting for an administrator.'
                                        : `${pending.length} workspace${pending.length === 1 ? '' : 's'} waiting for review.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pending.length === 0 ? (
                                    <EmptyState
                                        icon={Inbox}
                                        title="Nothing to review"
                                        description="New workspace requests will appear here as soon as they are submitted."
                                    />
                                ) : (
                                    <ul className="space-y-3">
                                        {pending.map((o) => (
                                            <li
                                                key={o.id}
                                                className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"
                                            >
                                                <Avatar name={o.name} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium">
                                                        {o.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Requested{' '}
                                                        {formatDate(
                                                            o.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                                <Button
                                                    className="w-full sm:w-auto"
                                                    disabled={
                                                        busy ===
                                                        `approve-${o.id}`
                                                    }
                                                    onClick={() =>
                                                        run(
                                                            `approve-${o.id}`,
                                                            `/organizations/${o.id}/approve`,
                                                            undefined,
                                                            `${o.name} was approved.`,
                                                        )
                                                    }
                                                >
                                                    {busy ===
                                                    `approve-${o.id}` ? (
                                                        <Loader2
                                                            className="size-4 animate-spin"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <ClipboardCheck
                                                            className="size-4"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    Approve
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle>Create a workspace</CardTitle>
                            <CardDescription>
                                New workspaces are reviewed before you can
                                publish vacancies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={create}
                                noValidate
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="workspace-name">
                                        Company name
                                    </Label>
                                    <Input
                                        id="workspace-name"
                                        value={name}
                                        maxLength={150}
                                        autoComplete="organization"
                                        placeholder="Acme Technologies"
                                        aria-invalid={nameInvalid}
                                        aria-describedby="workspace-name-help"
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        onBlur={() => setTouched(true)}
                                    />
                                    <p
                                        id="workspace-name-help"
                                        className={`text-xs ${nameInvalid ? 'text-destructive' : 'text-muted-foreground'}`}
                                    >
                                        {nameInvalid
                                            ? 'Enter at least 2 characters.'
                                            : 'The name candidates will see on your vacancies.'}
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={busy === 'create'}
                                >
                                    {busy === 'create' && (
                                        <Loader2
                                            className="size-4 animate-spin"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {busy === 'create'
                                        ? 'Creating…'
                                        : 'Create workspace'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs">
                        <CardHeader>
                            <CardTitle>Next steps</CardTitle>
                            <CardDescription>
                                {completed} of {steps.length} complete
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-4">
                                {steps.map((s, i) => (
                                    <li
                                        key={s.title}
                                        className="flex items-start gap-3"
                                    >
                                        <span
                                            className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                                                s.done
                                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                    : i === currentStep
                                                      ? 'border-primary bg-primary text-primary-foreground'
                                                      : 'text-muted-foreground'
                                            }`}
                                        >
                                            {s.done ? (
                                                <CheckCircle2
                                                    className="size-4"
                                                    aria-label="Done"
                                                />
                                            ) : (
                                                i + 1
                                            )}
                                        </span>
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <p
                                                className={`text-sm font-medium ${s.done ? 'text-muted-foreground' : ''}`}
                                            >
                                                {s.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {s.detail}
                                            </p>
                                        </div>
                                        {i === currentStep && s.action}
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

Workspace.layout = {
    breadcrumbs: [{ title: 'Employer workspace', href: '/workspace' }],
};
