import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/components/page-header';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { send } from '@/lib/api';

type Criterion = { text: string; type: 'required' | 'preferred' };
type Vacancy = { id: number; status: string; title: string | null };

const emptyCriterion = (): Criterion => ({ text: '', type: 'required' });

export default function Vacancies({
    organization,
    jobFamilies,
    vacancies,
}: {
    organization: { id: number; name: string };
    jobFamilies: { id: number; name: string }[];
    vacancies: Vacancy[];
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jobFamilyId, setJobFamilyId] = useState(
        String(jobFamilies[0]?.id ?? ''),
    );
    const [criteria, setCriteria] = useState<Criterion[]>([emptyCriterion()]);
    const [error, setError] = useState('');

    function setCriterion(i: number, change: Partial<Criterion>) {
        setCriteria(
            criteria.map((c, n) => (n === i ? { ...c, ...change } : c)),
        );
    }

    async function run(action: () => Promise<void>) {
        setError('');
        try {
            await action();
            router.reload();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    const create = () =>
        run(async () => {
            await send(`/organizations/${organization.id}/vacancies`, 'POST', {
                job_family_id: Number(jobFamilyId),
                title,
                description,
                criteria,
            });
            setTitle('');
            setDescription('');
            setCriteria([emptyCriterion()]);
        });

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
            <Head title="Vacancies" />
            <PageHeader
                title={organization.name}
                description="Create vacancies and publish them when ready."
            />

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>New vacancy</CardTitle>
                        <CardDescription>
                            Each save creates a new version of the requirements.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Junior React Developer"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What will this person work on?"
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Job family</Label>
                            <Select
                                value={jobFamilyId}
                                onValueChange={setJobFamilyId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobFamilies.map((f) => (
                                        <SelectItem
                                            key={f.id}
                                            value={String(f.id)}
                                        >
                                            {f.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Requirements</Label>
                            {criteria.map((c, i) => (
                                <div
                                    key={i}
                                    className="flex flex-wrap gap-2 sm:flex-nowrap"
                                >
                                    <Input
                                        value={c.text}
                                        onChange={(e) =>
                                            setCriterion(i, {
                                                text: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. React and TypeScript"
                                    />
                                    <Select
                                        value={c.type}
                                        onValueChange={(v) =>
                                            setCriterion(i, {
                                                type: v as Criterion['type'],
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-36 shrink-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="required">
                                                Required
                                            </SelectItem>
                                            <SelectItem value="preferred">
                                                Preferred
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={criteria.length === 1}
                                        onClick={() =>
                                            setCriteria(
                                                criteria.filter(
                                                    (_, n) => n !== i,
                                                ),
                                            )
                                        }
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setCriteria([...criteria, emptyCriterion()])
                                }
                            >
                                <Plus className="size-4" /> Add requirement
                            </Button>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={create}>Save as draft</Button>
                    </CardFooter>
                </Card>

                <Card className="h-fit lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Vacancies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {vacancies.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No vacancies yet.
                            </p>
                        )}
                        {vacancies.map((v) => (
                            <div
                                key={v.id}
                                className="flex items-center justify-between gap-3 rounded-lg border p-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {v.title}
                                    </p>
                                    <StatusBadge
                                        status={v.status}
                                        className="mt-1"
                                    />
                                </div>
                                {v.status === 'draft' && (
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            run(() =>
                                                send(
                                                    `/vacancies/${v.id}/publish`,
                                                    'POST',
                                                ),
                                            )
                                        }
                                    >
                                        Publish
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Vacancies.layout = {
    breadcrumbs: [
        { title: 'Employer workspace', href: '/workspace' },
        { title: 'Vacancies', href: '/workspace' },
    ],
};
