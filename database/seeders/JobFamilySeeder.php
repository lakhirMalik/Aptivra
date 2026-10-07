<?php

namespace Database\Seeders;

use App\Models\JobFamily;
use Illuminate\Database\Seeder;

class JobFamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['frontend' => 'Frontend Development', 'backend' => 'Backend Development', 'data-analysis' => 'Data Analysis'] as $slug => $name) {
            JobFamily::firstOrCreate(['slug' => $slug], ['name' => $name]);
        }
    }
}
