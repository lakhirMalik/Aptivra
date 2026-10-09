<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_lists_only_own_workspaces(): void
    {
        $user = User::factory()->create();
        $mine = Organization::create(['name' => 'Mine', 'status' => 'approved']);
        Organization::create(['name' => 'Other', 'status' => 'approved']);
        $mine->memberships()->create(['user_id' => $user->id, 'role' => 'owner']);

        $this->actingAs($user)->get('/dashboard')->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('organizations', 1)
            ->where('organizations.0.name', 'Mine')
            ->where('pendingCount', null));
    }
}
