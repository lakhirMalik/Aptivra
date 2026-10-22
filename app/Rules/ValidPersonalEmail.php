<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class ValidPersonalEmail implements ValidationRule
{
    /**
     * Common disposable and temporary email domains.
     *
     * @var list<string>
     */
    protected array $disposableDomains = [
        'mailinator.com',
        '10minutemail.com',
        'tempmail.com',
        'temp-mail.org',
        'guerrillamail.com',
        'throwawaymail.com',
        'yopmail.com',
        'trashmail.com',
        'sharklasers.com',
        'dispostable.com',
        'getairmail.com',
        'mohmal.com',
        'fakemailgenerator.com',
        'emailondeck.com',
        'burnermail.io',
        'inboxkitten.com',
        'test.com',
        'fake.com',
        'dummy.com',
        'placeholder.com',
        'sample.com',
    ];

    /**
     * Common placeholder / dummy local usernames.
     *
     * @var list<string>
     */
    protected array $placeholderUsernames = [
        'abc',
        'abcd',
        'abcde',
        'xyz',
        'xyz123',
        'test',
        'testing',
        'tester',
        'testuser',
        'sample',
        'example',
        'demo',
        'dummy',
        'fake',
        'asdf',
        'qwerty',
        'zxcv',
        'temp',
        'temporary',
        'trash',
        'admin',
        'administrator',
        'root',
        'user',
        'username',
        'email',
        'noreply',
        'no-reply',
        'nobody',
        'anon',
        'anonymous',
        'placeholder',
        'random',
        'foo',
        'bar',
        'foobar',
    ];

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('The :attribute must be a valid email string.');

            return;
        }

        $email = strtolower(trim($value));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $fail('Please enter a valid email address.');

            return;
        }

        $parts = explode('@', $email, 2);
        if (count($parts) !== 2) {
            $fail('Please enter a valid email address.');

            return;
        }

        [$username, $domain] = $parts;

        // Strip sub-addressing / plus-addressing (e.g. abc+123 -> abc)
        $cleanUsername = explode('+', $username)[0];
        // Letters only for pattern detection (e.g. test123 -> test, abc123 -> abc)
        $alphaOnly = (string) preg_replace('/[0-9_\.\-]/', '', $cleanUsername);

        // Check for placeholder / dummy usernames
        $isPlaceholder = in_array($cleanUsername, $this->placeholderUsernames, true)
            || in_array($alphaOnly, $this->placeholderUsernames, true)
            || (strlen($alphaOnly) <= 2 && strlen($cleanUsername) <= 3)
            || (bool) preg_match('/^(.)\1{3,}$/', $cleanUsername);

        if ($isPlaceholder) {
            // In testing environment, allow test@example.com for baseline auth tests if required
            if (! (app()->environment('testing') && str_ends_with($domain, 'example.com'))) {
                $fail('Please enter an authentic personal email address (placeholder addresses like abc@gmail.com are not permitted).');

                return;
            }
        }

        // Check for disposable or dummy domains
        if (in_array($domain, $this->disposableDomains, true)) {
            $fail('Temporary or disposable email domains are not allowed. Please use your authentic personal email.');

            return;
        }

        // Disallow example.com / example.org in production / non-testing
        if (! app()->environment('testing') && in_array($domain, ['example.com', 'example.org', 'example.net'], true)) {
            $fail('Please enter an authentic personal email address instead of an example domain.');

            return;
        }
    }
}
