import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { send } from '@/lib/api';

type Org = { id: number; name: string; status: string };

export default function Workspace({
    organizations,
    pending,
    isAdmin,
}: {
    organizations: Org[];
    pending: Pick<Org, 'id' | 'name'>[];
    isAdmin: boolean;
}) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    async function run(url: string, body?: unknown) {
        setError('');
        try {
            await send(url, 'POST', body);
            setName('');
            router.reload();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8 p-6">
            <Head title="Workspace" />
            <h1 className="text-2xl font-semibold">Employer workspace</h1>

            <section className="space-y-2">
                <h2 className="font-medium">Create a workspace</h2>
                <div className="flex gap-2">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Company name"
                    />
                    <Button onClick={() => run('/organizations', { name })}>
                        Create
                    </Button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </section>

            <section className="space-y-2">
                <h2 className="font-medium">My workspaces</h2>
                {organizations.length === 0 && (
                    <p className="text-sm">None yet.</p>
                )}
                {organizations.map((o) => (
                    <div
                        key={o.id}
                        className="flex items-center justify-between rounded border p-3"
                    >
                        <span>
                            {o.name}{' '}
                            <span className="text-sm opacity-70">
                                ({o.status})
                            </span>
                        </span>
                        {o.status === 'approved' ? (
                            <Link
                                href={`/organizations/${o.id}/vacancies`}
                                className="underline"
                            >
                                Vacancies
                            </Link>
                        ) : (
                            <span className="text-sm opacity-70">
                                Waiting for approval
                            </span>
                        )}
                    </div>
                ))}
            </section>

            {isAdmin && (
                <section className="space-y-2">
                    <h2 className="font-medium">Pending approvals</h2>
                    {pending.length === 0 && (
                        <p className="text-sm">Nothing pending.</p>
                    )}
                    {pending.map((o) => (
                        <div
                            key={o.id}
                            className="flex items-center justify-between rounded border p-3"
                        >
                            <span>{o.name}</span>
                            <Button
                                onClick={() =>
                                    run(`/organizations/${o.id}/approve`)
                                }
                            >
                                Approve
                            </Button>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
