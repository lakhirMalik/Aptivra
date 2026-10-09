import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatCard({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label: string;
    value: number;
    hint?: string;
    icon: LucideIcon;
}) {
    return (
        <Card className="gap-0 py-0 shadow-xs">
            <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                        {label}
                    </p>
                    <p className="text-3xl font-semibold tracking-tight tabular-nums">
                        {value}
                    </p>
                    {hint && (
                        <p className="text-xs text-muted-foreground">{hint}</p>
                    )}
                </div>
                <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                </div>
            </CardContent>
        </Card>
    );
}
