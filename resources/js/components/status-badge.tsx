import { CheckCircle2, Clock, FileText, OctagonX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const green =
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300';
const amber =
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300';
const red =
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300';
const gray = 'border-border bg-muted text-muted-foreground';

const styles = {
    approved: { label: 'Approved', icon: CheckCircle2, className: green },
    pending: { label: 'Awaiting approval', icon: Clock, className: amber },
    suspended: { label: 'Suspended', icon: OctagonX, className: red },
    draft: { label: 'Draft', icon: FileText, className: gray },
    open: { label: 'Published', icon: CheckCircle2, className: green },
};

export function StatusBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    const style = styles[status as keyof typeof styles];

    if (!style) {
        return (
            <Badge variant="outline" className={className}>
                {status}
            </Badge>
        );
    }

    const Icon = style.icon;

    return (
        <Badge
            variant="outline"
            className={`${style.className} ${className ?? ''}`}
        >
            <Icon className="size-3.5" aria-hidden="true" />
            {style.label}
        </Badge>
    );
}
