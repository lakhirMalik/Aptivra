<?php

namespace Tests\Feature;

use App\Models\JobFamily;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationOnboardingTest extends TestCase
{
    use RefreshDatabase;

    public function test_pending_organization_needs_admin_approval(): void
    {
        $family = JobFamily::create(['slug' => 'backend', 'name' => 'Backend']);
        $user = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);

        $id = $this->actingAs($user)->postJson('/organizations', ['name' => 'Acme'])
            ->assertCreated()->json('id');

        $payload = [
            'job_family_id' => $family->id, 'title' => 'Intern', 'description' => 'Test',
            'criteria' => [['text' => 'Laravel', 'type' => 'required']],
        ];

        $this->actingAs($user)->postJson("/organizations/{$id}/vacancies", $payload)->assertForbidden();
        $this->actingAs($user)->postJson("/organizations/{$id}/approve")->assertForbidden();
        $this->actingAs($admin)->postJson("/organizations/{$id}/approve")->assertOk();
        $this->actingAs($user)->postJson("/organizations/{$id}/vacancies", $payload)->assertCreated();
    }
}