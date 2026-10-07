<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $guarded = [];

    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }

    public function vacancies()
    {
        return $this->hasMany(Vacancy::class);
    }
}
