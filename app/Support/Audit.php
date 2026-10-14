<?php

namespace App\Support;

use App\Models\AuditEvent;
use Illuminate\Database\Eloquent\Model;

class Audit
{
    /** @param array<string, mixed> $meta */
    public static function record(string $event, ?int $userId, ?Model $subject = null, array $meta = []): void
    {
        AuditEvent::create([
            'user_id' => $userId,
            'event' => $event,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'meta' => $meta === [] ? null : $meta,
        ]);
    }
}
