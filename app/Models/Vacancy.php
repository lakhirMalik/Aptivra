<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    protected $guarded = [];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function jobFamily()
    {
        return $this->belongsTo(JobFamily::class);
    }

    public function versions()
    {
        return $this->hasMany(VacancyVersion::class);
    }
}
