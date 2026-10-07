<?php

namespace Tests\Feature;

use App\Models\JobFamily;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_denies_another_organization(): void
    {
        $family = JobFamily::create(['slug' => 'backend', 'name' => 'Backend']);
        $a = Organization::create(['name' => 'A', 'status' => 'approved']);
        $b = Organization::create(['name' => 'B', 'status' => 'approved']);
        $owner = User::factory()->create();
        $outsider = User::factory()->create();
        $a->memberships()->create(['user_id' => $owner->id, 'role' => 'owner']);
        $b->memberships()->create(['user_id' => $outsider->id, 'role' => 'owner']);

        $payload = [
            'job_family_id' => $family->id, 'title' => 'Intern', 'description' => 'Test',
            'criteria' => [['text' => 'Laravel', 'type' => 'required']],
        ];

        $id = $this->actingAs($owner)->postJson("/organizations/{$a->id}/vacancies", $payload)
            ->assertCreated()->json('id');

        $this->actingAs($outsider)->postJson("/vacancies/{$id}/publish")->assertForbidden();
        $this->actingAs($outsider)->postJson("/organizations/{$a->id}/vacancies", $payload)->assertForbidden();
        $this->actingAs($owner)->postJson("/vacancies/{$id}/publish")->assertOk();
    }
}