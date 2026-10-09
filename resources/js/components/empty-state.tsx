import type { LucideIcon } from 'lucide-react';

export function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
            <div className="rounded-full bg-accent p-3 text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
            </div>
            <p className="font-medium">{title}</p>
            <p className="max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
