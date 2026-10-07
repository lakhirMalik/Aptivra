<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vacancy extends Model
{
    protected $guarded = [];

    /** @return BelongsTo<Organization, $this> */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /** @return BelongsTo<JobFamily, $this> */
    public function jobFamily(): BelongsTo
    {
        return $this->belongsTo(JobFamily::class);
    }

    /** @return HasMany<VacancyVersion, $this> */
    public function versions(): HasMany
    {
        return $this->hasMany(VacancyVersion::class);
    }
}
