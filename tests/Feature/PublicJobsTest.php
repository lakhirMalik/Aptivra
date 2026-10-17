<?php

namespace Tests\Feature;

use App\Models\JobFamily;
use App\Models\Organization;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicJobsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_browsing_only_lists_open_vacancies(): void
    {
        $frontend = JobFamily::create(['slug' => 'frontend', 'name' => 'Frontend Development']);
        $backend = JobFamily::create(['slug' => 'backend', 'name' => 'Backend Development']);
        $org = Organization::create(['name' => 'Pixel Harbor Studio', 'status' => 'approved']);

        // Open vacancy (Frontend)
        $v1 = Vacancy::create([
            'organization_id' => $org->id,
            'job_family_id' => $frontend->id,
            'status' => 'open',
            'current_version' => 1,
        ]);
        $v1->versions()->create([
            'version' => 1,
            'title' => 'Junior Frontend Developer',
            'description' => 'Build React apps',
            'criteria' => [
                ['text' => 'React', 'type' => 'required'],
                ['text' => 'TypeScript', 'type' => 'preferred'],
            ],
            'published_at' => now(),
        ]);

        // Draft vacancy (Frontend)
        $v2 = Vacancy::create([
            'organization_id' => $org->id,
            'job_family_id' => $frontend->id,
            'status' => 'draft',
            'current_version' => 1,
        ]);
        $v2->versions()->create([
            'version' => 1,
            'title' => 'Draft Developer',
            'description' => 'Draft description',
            'criteria' => [['text' => 'HTML', 'type' => 'required']],
        ]);

        // Closed vacancy (Backend)
        $v3 = Vacancy::create([
            'organization_id' => $org->id,
            'job_family_id' => $backend->id,
            'status' => 'closed',
            'current_version' => 1,
        ]);
        $v3->versions()->create([
            'version' => 1,
            'title' => 'Backend Lead',
            'description' => 'Closed position',
            'criteria' => [['text' => 'PHP', 'type' => 'required']],
            'published_at' => now()->subDays(5),
        ]);

        // Unauthenticated guest can access /jobs
        $response = $this->get('/jobs');
        $response->assertOk();

        // Check Inertia props for open vacancies
        $response->assertInertia(fn ($page) => $page
            ->component('jobs/index')
            ->has('vacancies', 1)
            ->where('vacancies.0.id', $v1->id)
            ->where('vacancies.0.title', 'Junior Frontend Developer')
            ->where('vacancies.0.organization', 'Pixel Harbor Studio')
        );

        // Filter by backend family returns empty because v3 is closed
        $this->get('/jobs?family=backend')->assertInertia(fn ($page) => $page
            ->component('jobs/index')
            ->has('vacancies', 0)
        );

        // Single vacancy view
        $this->get("/jobs/{$v1->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('jobs/show')
                ->where('vacancy.id', $v1->id)
                ->where('vacancy.title', 'Junior Frontend Developer')
                ->has('vacancy.criteria', 2)
            );

        // Accessing draft or closed vacancy returns 404
        $this->get("/jobs/{$v2->id}")->assertNotFound();
        $this->get("/jobs/{$v3->id}")->assertNotFound();
    }
}
