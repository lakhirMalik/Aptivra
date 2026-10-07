import { useEffect, useState } from 'react';
import Shell, { Btn, Coverage, Note } from '../../prototype/shell';
import {
    RoleKey,
    applicants,
    compare,
    questions,
    roles,
    statusText,
} from '../../prototype/mock';

const STAGES = ['queued', 'scanning', 'extracting', 'ready'];

export default function Candidate() {
    const [step, setStep] = useState<
        'role' | 'upload' | 'report' | 'practice' | 'guidance'
    >('role');
    const [role, setRole] = useState<RoleKey>('frontend');
    const [cvId, setCvId] = useState('cv01');
    const [stage, setStage] = useState(-1);
    const [qi, setQi] = useState(0);
    const [pick, setPick] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const cv = applicants.find((a) => a.id === cvId)!;
    const r = roles[role];
    const rows = compare([...r.required], cv.skills);
    const pre = compare([...r.preferred], cv.skills);
    const qs = questions.filter((q) => q.role === role);

    useEffect(() => {
        if (stage < 0 || stage >= STAGES.length - 1) return;
        const t = setTimeout(() => setStage(stage + 1), 700);
        return () => clearTimeout(t);
    }, [stage]);

    const done = stage === STAGES.length - 1;

    return (
        <Shell title="Candidate" active="candidate">
            {step === 'role' && (
                <>
                    <h1 className="text-xl font-semibold">
                        Choose a role to prepare for
                    </h1>
                    {(Object.keys(roles) as RoleKey[]).map((k) => (
                        <label
                            key={k}
                            className="flex gap-2 rounded border p-3"
                        >
                            <input
                                type="radio"
                                checked={role === k}
                                onChange={() => setRole(k)}
                            />{' '}
                            {roles[k].title}
                        </label>
                    ))}
                    <p className="text-sm text-slate-500">
                        Other roles are outside the evaluated scope.
                    </p>
                    <Btn onClick={() => setStep('upload')}>Continue</Btn>
                </>
            )}
            {step === 'upload' && (
                <>
                    <h1 className="text-xl font-semibold">Upload your CV</h1>
                    <Note>
                        One-off check: your CV and report are deleted 24 hours
                        after completion. You can download the report free.
                    </Note>
                    <select
                        className="w-full rounded border p-2"
                        value={cvId}
                        onChange={(e) => {
                            setCvId(e.target.value);
                            setStage(-1);
                        }}
                    >
                        {applicants.map((a) => (
                            <option key={a.id} value={a.id}>
                                Sample CV: {a.name} ({a.status})
                            </option>
                        ))}
                    </select>
                    <Btn onClick={() => setStage(0)} disabled={stage >= 0}>
                        Check my CV
                    </Btn>
                    {stage >= 0 && (
                        <p className="text-sm">
                            Status:{' '}
                            <b>
                                {cv.status === 'ready' || !done
                                    ? STAGES[stage]
                                    : cv.status}
                            </b>
                        </p>
                    )}
                    {done && cv.status !== 'ready' && (
                        <Note>{statusText[cv.status]}</Note>
                    )}
                    {done && cv.status === 'ready' && (
                        <Btn onClick={() => setStep('report')}>View report</Btn>
                    )}
                </>
            )}
            {step === 'report' && (
                <>
                    <h1 className="text-xl font-semibold">
                        {r.title}: CV report
                    </h1>
                    <p className="text-sm">
                        {rows.filter((x) => x.found).length} of {rows.length}{' '}
                        required criteria evidenced (role criteria v1). This is
                        not a hiring probability.
                    </p>
                    <h2 className="font-medium">Required</h2>
                    <Coverage rows={rows} />
                    <h2 className="font-medium">Preferred</h2>
                    <Coverage rows={pre} />
                    <Note>
                        A skill missing from your CV does not mean you lack it.
                        It means the CV does not show it.
                    </Note>
                    <div className="flex gap-2">
                        <Btn
                            onClick={() => {
                                setQi(0);
                                setPick(null);
                                setScore(0);
                                setStep('practice');
                            }}
                        >
                            Practice questions
                        </Btn>
                        <Btn onClick={() => setStep('guidance')}>
                            Learning guidance
                        </Btn>
                        <Btn onClick={() => window.print()}>
                            Download report
                        </Btn>
                    </div>
                </>
            )}
            {step === 'practice' && (
                <>
                    <h1 className="text-xl font-semibold">Private practice</h1>
                    <p className="text-sm text-slate-500">
                        Never shown to employers.
                    </p>
                    {qi < qs.length ? (
                        <>
                            <p className="font-medium">{qs[qi].q}</p>
                            {qs[qi].o.map((o, i) => (
                                <button
                                    key={o}
                                    disabled={pick !== null}
                                    onClick={() => {
                                        setPick(i);
                                        if (i === qs[qi].a) setScore(score + 1);
                                    }}
                                    className={`block w-full rounded border p-2 text-left ${pick !== null && i === qs[qi].a ? 'border-green-600' : ''}`}
                                >
                                    {o}
                                </button>
                            ))}
                            {pick !== null && (
                                <Btn
                                    onClick={() => {
                                        setQi(qi + 1);
                                        setPick(null);
                                    }}
                                >
                                    Next
                                </Btn>
                            )}
                        </>
                    ) : (
                        <p>
                            Score: {score} / {qs.length}
                        </p>
                    )}
                    <Btn onClick={() => setStep('report')}>Back to report</Btn>
                </>
            )}
            {step === 'guidance' && (
                <>
                    <h1 className="text-xl font-semibold">Learning guidance</h1>
                    {[...rows, ...pre]
                        .filter((x) => !x.found)
                        .map((x) => (
                            <p
                                key={x.criterion}
                                className="rounded border p-3 text-sm"
                            >
                                Next step: add evidence of <b>{x.criterion}</b>.
                                A reviewed learning resource will appear here.
                            </p>
                        ))}
                    <Btn onClick={() => setStep('report')}>Back to report</Btn>
                </>
            )}
        </Shell>
    );
}
