import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { send } from '@/lib/api';

type Criterion = { text: string; type: 'required' | 'preferred' };
type Vacancy = { id: number; status: string; title: string | null };

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
    const [jobFamilyId, setJobFamilyId] = useState(jobFamilies[0]?.id ?? 0);
    const [criteria, setCriteria] = useState<Criterion[]>([
        { text: '', type: 'required' },
    ]);
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
                job_family_id: jobFamilyId,
                title,
                description,
                criteria,
            });
            setTitle('');
            setDescription('');
            setCriteria([{ text: '', type: 'required' }]);
        });

    return (
        <div className="mx-auto max-w-2xl space-y-8 p-6">
            <Head title="Vacancies" />
            <h1 className="text-2xl font-semibold">
                {organization.name}: vacancies
            </h1>

            <section className="space-y-3">
                <h2 className="font-medium">New vacancy</h2>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <textarea
                    className="w-full rounded border p-2"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <select
                    className="w-full rounded border p-2"
                    value={jobFamilyId}
                    onChange={(e) => setJobFamilyId(Number(e.target.value))}
                >
                    {jobFamilies.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>

                {criteria.map((c, i) => (
                    <div key={i} className="flex gap-2">
                        <Input
                            value={c.text}
                            onChange={(e) =>
                                setCriterion(i, { text: e.target.value })
                            }
                            placeholder="Requirement"
                        />
                        <select
                            className="rounded border p-2"
                            value={c.type}
                            onChange={(e) =>
                                setCriterion(i, {
                                    type: e.target.value as Criterion['type'],
                                })
                            }
                        >
                            <option value="required">Required</option>
                            <option value="preferred">Preferred</option>
                        </select>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setCriteria(criteria.filter((_, n) => n !== i))
                            }
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCriteria([
                                ...criteria,
                                { text: '', type: 'required' },
                            ])
                        }
                    >
                        Add requirement
                    </Button>
                    <Button onClick={create}>Save as draft</Button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </section>

            <section className="space-y-2">
                <h2 className="font-medium">Vacancies</h2>
                {vacancies.length === 0 && <p className="text-sm">None yet.</p>}
                {vacancies.map((v) => (
                    <div
                        key={v.id}
                        className="flex items-center justify-between rounded border p-3"
                    >
                        <span>
                            {v.title}{' '}
                            <span className="text-sm opacity-70">
                                ({v.status})
                            </span>
                        </span>
                        {v.status === 'draft' && (
                            <Button
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
            </section>
        </div>
    );
}
