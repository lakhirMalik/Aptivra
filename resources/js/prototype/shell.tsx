import { Head, Link } from '@inertiajs/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export default function Shell({
    title,
    active,
    children,
}: {
    title: string;
    active: 'candidate' | 'employer';
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Head title={title} />
            <header className="flex items-center justify-between border-b px-6 py-3">
                <span className="font-semibold">
                    Aptivra{' '}
                    <span className="text-xs font-normal text-slate-500">
                        prototype, mock data
                    </span>
                </span>
                <nav className="flex gap-2 text-sm">
                    {(['candidate', 'employer'] as const).map((w) => (
                        <Link
                            key={w}
                            href={`/prototype/${w}`}
                            className={`rounded px-3 py-1 ${active === w ? 'bg-slate-900 text-white' : 'border'}`}
                        >
                            {w === 'candidate'
                                ? 'Candidate workspace'
                                : 'Employer workspace'}
                        </Link>
                    ))}
                </nav>
            </header>
            <main className="mx-auto max-w-3xl space-y-4 p-6">{children}</main>
        </div>
    );
}

export const Note = ({ children }: { children: ReactNode }) => (
    <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm">
        {children}
    </p>
);

export const Btn = ({
    className = '',
    ...p
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...p}
        className={`rounded bg-slate-900 px-3 py-1.5 text-sm text-white disabled:opacity-40 ${className}`}
    />
);

export const Coverage = ({
    rows,
}: {
    rows: { criterion: string; found: boolean; ref: string }[];
}) => (
    <table className="w-full text-sm">
        <tbody>
            {rows.map((r) => (
                <tr key={r.criterion} className="border-b">
                    <td className="py-1.5">{r.criterion}</td>
                    <td
                        className={
                            r.found ? 'text-green-700' : 'text-slate-500'
                        }
                    >
                        {r.found ? 'Evidenced' : 'Not shown in CV'}
                    </td>
                    <td className="text-slate-500">{r.ref}</td>
                </tr>
            ))}
        </tbody>
    </table>
);
