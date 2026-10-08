<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkspacePagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_pages_render_and_outsiders_are_denied(): void
    {
        $user = User::factory()->create();
        $outsider = User::factory()->create();
        $org = Organization::create(['name' => 'A', 'status' => 'approved']);
        $org->memberships()->create(['user_id' => $user->id, 'role' => 'owner']);

        $this->actingAs($user)->get('/workspace')->assertOk();
        $this->actingAs($user)->get("/organizations/{$org->id}/vacancies")->assertOk();
        $this->actingAs($outsider)->get("/organizations/{$org->id}/vacancies")->assertForbidden();
    }
}
