<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'candidate',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('audit_events', [
            'event' => 'account.registered',
        ]);
    }

    public function test_employers_can_register_and_redirect_to_workspace(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Employer User',
            'email' => 'employer@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'employer',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/workspace');
        $this->assertDatabaseHas('audit_events', [
            'event' => 'account.registered',
        ]);
    }
}
