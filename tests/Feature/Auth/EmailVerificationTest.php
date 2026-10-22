<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_screen_can_be_rendered(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get(route('verification.notice'));

        $response->assertOk();
    }

    public function test_email_can_be_verified(): void
    {
        Event::fake();

        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->actingAs($user)->get($verificationUrl);

        Event::assertDispatched(Verified::class);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $response->assertRedirect(route('dashboard', absolute: false).'?verified=1');
    }

    public function test_email_is_not_verified_with_invalid_hash(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1('wrong-email@example.com')]
        );

        $this->actingAs($user)->get($verificationUrl);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_unverified_user_cannot_access_dashboard_and_is_redirected_to_verify_prompt(): void
    {
        $user = User::factory()->candidate()->unverified()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('verification.notice'));
    }

    public function test_unverified_employer_cannot_access_workspace(): void
    {
        $employer = User::factory()->employer()->unverified()->create();

        $response = $this->actingAs($employer)->get('/workspace');

        $response->assertRedirect(route('verification.notice'));
    }

    public function test_placeholder_emails_like_abc_gmail_com_are_rejected(): void
    {
        $placeholders = [
            'abc@gmail.com',
            'test@gmail.com',
            'dummy@yahoo.com',
            'asdf@gmail.com',
            'temp@outlook.com',
            'xyz@gmail.com',
            'admin@gmail.com',
        ];

        foreach ($placeholders as $email) {
            $response = $this->post(route('register.store'), [
                'name' => 'John Candidate',
                'email' => $email,
                'password' => 'SecurePass123!',
                'password_confirmation' => 'SecurePass123!',
                'account_type' => 'candidate',
            ]);

            $response->assertSessionHasErrors(['email']);
        }
    }

    public function test_disposable_email_domains_are_rejected(): void
    {
        $disposableEmails = [
            'candidate@mailinator.com',
            'candidate@10minutemail.com',
            'candidate@tempmail.com',
            'candidate@yopmail.com',
        ];

        foreach ($disposableEmails as $email) {
            $response = $this->post(route('register.store'), [
                'name' => 'Jane Candidate',
                'email' => $email,
                'password' => 'SecurePass123!',
                'password_confirmation' => 'SecurePass123!',
                'account_type' => 'candidate',
            ]);

            $response->assertSessionHasErrors(['email']);
        }
    }

    public function test_valid_personal_email_is_accepted_for_registration(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Valid User',
            'email' => 'vishesh.dev@gmail.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'account_type' => 'candidate',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('users', ['email' => 'vishesh.dev@gmail.com']);
    }
}
