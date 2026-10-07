<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VacancyVersion extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    protected $casts = ['criteria' => 'array', 'published_at' => 'datetime'];
}
