import { useState } from 'react';
import Shell, { Btn, Coverage, Note } from '../../prototype/shell';
import { applicants, compare, statusText } from '../../prototype/mock';

export default function Employer() {
    const [tab, setTab] = useState<'vacancy' | 'applicants' | 'review'>(
        'vacancy',
    );
    const [title, setTitle] = useState('Junior Frontend Developer');
    const [req, setReq] = useState('HTML, CSS, JavaScript, React');
    const [pre, setPre] = useState('TypeScript, Accessibility');
    const [version, setVersion] = useState(1);
    const [sel, setSel] = useState(applicants[0].id);
    const [invited, setInvited] = useState<string[]>([]);
    const [note, setNote] = useState('');
    const [log, setLog] = useState<string[]>([]);

    const list = (s: string) =>
        s
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
    const a = applicants.find((x) => x.id === sel)!;
    const rows = compare(list(req), a.skills);
    const pr = compare(list(pre), a.skills);
    const decide = (d: string) => {
        setLog([`${a.name}: ${d}${note ? ` (${note})` : ''}`, ...log]);
        setNote('');
    };

    return (
        <Shell title="Employer" active="employer">
            <Note>
                Workspace: Nimbus Labs (fictional). Applications from other
                organizations are not visible here.
            </Note>
            <div className="flex gap-2 text-sm">
                {(['vacancy', 'applicants', 'review'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`rounded px-3 py-1 ${tab === t ? 'bg-slate-900 text-white' : 'border'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
            {tab === 'vacancy' && (
                <>
                    <h1 className="text-xl font-semibold">
                        Vacancy (criteria version {version})
                    </h1>
                    <input
                        className="w-full rounded border p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label className="block text-sm">
                        Required criteria
                        <input
                            className="w-full rounded border p-2"
                            value={req}
                            onChange={(e) => setReq(e.target.value)}
                        />
                    </label>
                    <label className="block text-sm">
                        Preferred criteria
                        <input
                            className="w-full rounded border p-2"
                            value={pre}
                            onChange={(e) => setPre(e.target.value)}
                        />
                    </label>
                    <Btn onClick={() => setVersion(version + 1)}>
                        Publish new version
                    </Btn>
                    <p className="text-sm text-slate-500">
                        Existing applications keep the criteria version they
                        applied under.
                    </p>
                </>
            )}
            {tab === 'applicants' && (
                <>
                    <h1 className="text-xl font-semibold">
                        {title}: applicants
                    </h1>
                    {applicants.map((x) => {
                        const c = compare(list(req), x.skills).filter(
                            (y) => y.found,
                        ).length;
                        return (
                            <button
                                key={x.id}
                                onClick={() => {
                                    setSel(x.id);
                                    setTab('review');
                                }}
                                className="flex w-full justify-between rounded border p-3 text-left text-sm"
                            >
                                <span>{x.name}</span>
                                <span className="text-slate-500">
                                    {x.status === 'ready'
                                        ? `${c} of ${list(req).length} required evidenced (v${version})`
                                        : x.status}
                                </span>
                            </button>
                        );
                    })}
                </>
            )}
            {tab === 'review' && (
                <>
                    <h1 className="text-xl font-semibold">{a.name}</h1>
                    <section className="space-y-2 rounded border p-3">
                        <h2 className="font-medium">
                            1. CV claims (source-linked)
                        </h2>
                        {a.status === 'ready' ? (
                            <>
                                <Coverage rows={rows} />
                                <Coverage rows={pr} />
                            </>
                        ) : (
                            <Note>{statusText[a.status]}</Note>
                        )}
                    </section>
                    <section className="space-y-2 rounded border p-3">
                        <h2 className="font-medium">2. Assessment results</h2>
                        <p className="text-sm">
                            {invited.includes(a.id)
                                ? 'Test invited (mock). Results will appear here separately from CV claims.'
                                : 'No test requested. Optional.'}
                        </p>
                        <Btn
                            disabled={invited.includes(a.id)}
                            onClick={() => setInvited([...invited, a.id])}
                        >
                            Invite to test
                        </Btn>
                    </section>
                    <section className="space-y-2 rounded border p-3">
                        <h2 className="font-medium">
                            3. Reviewer decision (human only)
                        </h2>
                        <input
                            className="w-full rounded border p-2 text-sm"
                            placeholder="Reviewer note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                            {['Shortlist', 'Interview', 'Reject'].map((d) => (
                                <Btn key={d} onClick={() => decide(d)}>
                                    {d}
                                </Btn>
                            ))}
                        </div>
                        {log.map((l, i) => (
                            <p key={i} className="text-sm text-slate-600">
                                {l}
                            </p>
                        ))}
                    </section>
                </>
            )}
        </Shell>
    );
}
