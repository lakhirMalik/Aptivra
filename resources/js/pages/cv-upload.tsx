import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    FileText,
    Loader2,
    Lock,
    ShieldCheck,
    Timer,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
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
import { getJson, remove, uploadFile } from '@/lib/api';

type Doc = {
    id: number;
    original_name: string;
    status: string;
    failure_reason: string | null;
    expires_at: string;
};

const MAX_MB = 5;
const WAITING = ['quarantined', 'scanning'];

const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
    });

export default function CvUpload() {
    const [doc, setDoc] = useState<Doc | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);
    const [removing, setRemoving] = useState(false);
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!doc || !WAITING.includes(doc.status)) {
            return;
        }

        const timer = setInterval(async () => {
            try {
                setDoc(await getJson<Doc>(`/cv-documents/${doc.id}`));
            } catch (e) {
                setError((e as Error).message);
                setDoc(null);
            }
        }, 2000);

        return () => clearInterval(timer);
    }, [doc]);

    async function upload(file: File | undefined) {
        if (!file) {
            return;
        }

        const extension = file.name.split('.').pop()?.toLowerCase();

        if (extension !== 'pdf' && extension !== 'docx') {
            setError('Only PDF and DOCX files are supported.');

            return;
        }

        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`The file is larger than ${MAX_MB} MB.`);

            return;
        }

        setError('');
        setProgress(0);

        try {
            setDoc(await uploadFile<Doc>('/cv-documents', file, setProgress));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setProgress(null);
        }
    }

    async function discard() {
        if (!doc) {
            return;
        }

        setRemoving(true);
        setError('');

        try {
            await remove(`/cv-documents/${doc.id}`);
            setDoc(null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setRemoving(false);
        }
    }

    function onDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);
        void upload(e.dataTransfer.files[0]);
    }

    const uploading = progress !== null;

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6 lg:gap-8">
            <Head title="CV upload" />
            <PageHeader
                title="CV upload"
                description="Upload your CV for a private safety scan. Analysis against a role is added in the next release."
            />

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                <Card className="min-w-0 shadow-xs lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{doc ? 'Your CV' : 'Upload a CV'}</CardTitle>
                        <CardDescription>
                            PDF or DOCX, up to {MAX_MB} MB.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!doc ? (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                                    dragging ? 'border-primary bg-accent' : ''
                                }`}
                            >
                                <div className="rounded-full bg-accent p-3 text-accent-foreground">
                                    <UploadCloud
                                        className="size-6"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        Drag your CV here
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        or choose a file from your computer
                                    </p>
                                </div>
                                <input
                                    ref={input}
                                    id="cv-file"
                                    type="file"
                                    accept=".pdf,.docx"
                                    className="sr-only"
                                    aria-label="Choose a CV file"
                                    onChange={(e) => {
                                        void upload(e.target.files?.[0]);
                                        e.target.value = '';
                                    }}
                                />
                                <Button
                                    disabled={uploading}
                                    onClick={() => input.current?.click()}
                                >
                                    {uploading && (
                                        <Loader2
                                            className="size-4 animate-spin"
                                            aria-hidden="true"
                                        />
                                    )}
                                    {uploading
                                        ? `Uploading ${progress}%`
                                        : 'Choose file'}
                                </Button>
                                {uploading && (
                                    <div
                                        role="progressbar"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={progress}
                                        className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted"
                                    >
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                                    <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
                                        <FileText
                                            className="size-5"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <p className="truncate font-medium">
                                            {doc.original_name}
                                        </p>
                                        <StatusBadge status={doc.status} />
                                    </div>
                                    <Button
                                        variant="outline"
                                        disabled={removing}
                                        onClick={discard}
                                    >
                                        {removing ? (
                                            <Loader2
                                                className="size-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Trash2
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Delete now
                                    </Button>
                                </div>

                                <div aria-live="polite" className="text-sm">
                                    {WAITING.includes(doc.status) && (
                                        <p className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2
                                                className="size-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                            Scanning your file. This usually
                                            takes a few seconds.
                                        </p>
                                    )}
                                    {doc.status === 'clean' && (
                                        <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            Your file passed the safety scan. It
                                            will be deleted automatically on{' '}
                                            {formatDateTime(doc.expires_at)}.
                                        </p>
                                    )}
                                    {(doc.status === 'infected' ||
                                        doc.status === 'scan_unavailable') && (
                                        <div className="space-y-3">
                                            <p className="text-destructive">
                                                {doc.failure_reason}
                                            </p>
                                            <Button onClick={discard}>
                                                Upload a different file
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="h-fit shadow-xs">
                    <CardHeader>
                        <CardTitle>How your CV is handled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <Lock
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span>
                                    Private to you. Employers cannot see it.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <ShieldCheck
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span>
                                    Scanned for malware before anything else
                                    happens. A file that cannot be scanned is
                                    never treated as safe.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Timer
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                <span>
                                    Deleted automatically 24 hours after upload.
                                    You can delete it sooner.
                                </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

CvUpload.layout = {
    breadcrumbs: [{ title: 'CV upload', href: '/cv-upload' }],
};
