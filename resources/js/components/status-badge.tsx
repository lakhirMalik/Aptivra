import { CheckCircle2, Clock, OctagonX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const styles = {
    approved: {
        label: 'Approved',
        icon: CheckCircle2,
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    },
    pending: {
        label: 'Awaiting approval',
        icon: Clock,
        className:
            'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    },
    suspended: {
        label: 'Suspended',
        icon: OctagonX,
        className:
            'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    },
};

export function StatusBadge({ status }: { status: string }) {
    const style = styles[status as keyof typeof styles];

    if (!style) {
        return <Badge variant="outline">{status}</Badge>;
    }

    const Icon = style.icon;

    return (
        <Badge variant="outline" className={style.className}>
            <Icon className="size-3.5" aria-hidden="true" />
            {style.label}
        </Badge>
    );
}
