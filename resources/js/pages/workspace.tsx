import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
        <div className="mx-auto max-w-3xl space-y-6 p-6">
            <Head title="Workspace" />
            <h1 className="text-2xl font-semibold">Employer workspace</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Create a workspace</CardTitle>
                    <CardDescription>
                        New workspaces are reviewed before you can publish
                        vacancies.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
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
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My workspaces</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {organizations.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No workspaces yet.
                        </p>
                    )}
                    {organizations.map((o) => (
                        <div
                            key={o.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{o.name}</span>
                                <Badge
                                    variant={
                                        o.status === 'approved'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {o.status === 'approved'
                                        ? 'Approved'
                                        : 'Waiting for approval'}
                                </Badge>
                            </div>
                            {o.status === 'approved' && (
                                <Button asChild size="sm" variant="outline">
                                    <Link
                                        href={`/organizations/${o.id}/vacancies`}
                                    >
                                        Vacancies
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending approvals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pending.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Nothing pending.
                            </p>
                        )}
                        {pending.map((o) => (
                            <div
                                key={o.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <span className="font-medium">{o.name}</span>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        run(`/organizations/${o.id}/approve`)
                                    }
                                >
                                    Approve
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
