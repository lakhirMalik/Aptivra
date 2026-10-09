import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    ClipboardCheck,
    Circle,
    Inbox,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
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

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <Card className="gap-1 py-4">
            <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-semibold tabular-nums">{value}</p>
            </CardContent>
        </Card>
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
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    async function run(
        key: string,
        url: string,
        body: unknown,
        success: string,
    ) {
        setBusy(key);
        setError('');
        setNotice('');
        try {
            await send(url, 'POST', body);
            setNotice(success);
            router.reload();
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(null);
        }
    }

    async function create(e: FormEvent) {
        e.preventDefault();
        await run(
            'create',
            '/organizations',
            { name },
            'Workspace created. It is now waiting for approval.',
        );
        setName('');
    }

    const approved = organizations.filter(
        (o) => o.status === 'approved',
    ).length;
    const totalVacancies = organizations.reduce(
        (sum, o) => sum + o.vacancies_count,
        0,
    );

    const steps = [
        {
            done: organizations.length > 0,
            text: 'Create your employer workspace',
        },
        { done: approved > 0, text: 'Wait for approval' },
        { done: totalVacancies > 0, text: 'Create your first vacancy' },
    ];

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
            <Head title="Employer workspace" />
            <PageHeader
                title="Employer workspace"
                description="Create a workspace for your company, get it approved, then publish vacancies and review applicants."
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Workspaces" value={organizations.length} />
                <Stat label="Approved" value={approved} />
                <Stat label="Vacancies" value={totalVacancies} />
            </div>

            {(error || notice) && (
                <p
                    role={error ? 'alert' : 'status'}
                    className={`rounded-lg border px-4 py-3 text-sm ${error ? 'border-destructive/40 text-destructive' : 'border-emerald-300 text-emerald-800 dark:text-emerald-300'}`}
                >
                    {error || notice}
                </p>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <aside className="space-y-6 lg:col-start-3 lg:row-start-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create a workspace</CardTitle>
                            <CardDescription>
                                New workspaces are reviewed before you can
                                publish vacancies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={create} className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="workspace-name">
                                        Company name
                                    </Label>
                                    <Input
                                        id="workspace-name"
                                        value={name}
                                        maxLength={150}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Acme Technologies"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        busy === 'create' || name.trim() === ''
                                    }
                                >
                                    {busy === 'create' && (
                                        <Loader2
                                            className="size-4 animate-spin"
                                            aria-hidden="true"
                                        />
                                    )}
                                    Create workspace
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Next steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-3">
                                {steps.map((s) => (
                                    <li
                                        key={s.text}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        {s.done ? (
                                            <CheckCircle2
                                                className="size-5 text-emerald-600"
                                                aria-label="Done"
                                            />
                                        ) : (
                                            <Circle
                                                className="size-5 text-muted-foreground"
                                                aria-label="Not done"
                                            />
                                        )}
                                        <span
                                            className={
                                                s.done
                                                    ? 'text-muted-foreground line-through'
                                                    : ''
                                            }
                                        >
                                            {s.text}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                </aside>

                <div className="space-y-6 lg:col-span-2 lg:col-start-1 lg:row-start-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your workspaces</CardTitle>
                            <CardDescription>
                                Workspaces you belong to.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {organizations.length === 0 && (
                                <EmptyState
                                    icon={Building2}
                                    title="No workspaces yet"
                                    description="Create your first workspace using the form to start hiring on Aptivra."
                                />
                            )}
                            {organizations.map((o) => (
                                <div
                                    key={o.id}
                                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 space-y-1">
                                        <p className="truncate font-medium">
                                            {o.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Created {formatDate(o.created_at)} ·{' '}
                                            {o.vacancies_count}{' '}
                                            {o.vacancies_count === 1
                                                ? 'vacancy'
                                                : 'vacancies'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={o.status} />
                                        {o.status === 'approved' && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={`/organizations/${o.id}/vacancies`}
                                                >
                                                    View vacancies
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {isAdmin && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Approval queue</CardTitle>
                                <CardDescription>
                                    Workspaces waiting for an administrator.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {pending.length === 0 && (
                                    <EmptyState
                                        icon={Inbox}
                                        title="Nothing to review"
                                        description="New workspace requests will appear here."
                                    />
                                )}
                                {pending.map((o) => (
                                    <div
                                        key={o.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {o.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Requested{' '}
                                                {formatDate(o.created_at)}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            disabled={
                                                busy === `approve-${o.id}`
                                            }
                                            onClick={() =>
                                                run(
                                                    `approve-${o.id}`,
                                                    `/organizations/${o.id}/approve`,
                                                    undefined,
                                                    `${o.name} approved.`,
                                                )
                                            }
                                        >
                                            {busy === `approve-${o.id}` ? (
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
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

Workspace.layout = {
    breadcrumbs: [{ title: 'Employer workspace', href: '/workspace' }],
};
