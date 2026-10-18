import { Form, Head } from '@inertiajs/react';
import { Building2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const [accountType, setAccountType] = useState<'candidate' | 'employer'>(
        () => {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                if (params.get('type') === 'employer') {
                    return 'employer';
                }
            }
            return 'candidate';
        },
    );

    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>I want to</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label
                                        className={`flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-3.5 transition-colors ${
                                            accountType === 'candidate'
                                                ? 'border-primary bg-primary/5 text-foreground'
                                                : 'border-border text-muted-foreground hover:bg-muted/40'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="account_type"
                                            value="candidate"
                                            checked={
                                                accountType === 'candidate'
                                            }
                                            onChange={() =>
                                                setAccountType('candidate')
                                            }
                                            className="sr-only"
                                        />
                                        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                            <UserIcon
                                                className="size-4 text-primary"
                                                aria-hidden="true"
                                            />
                                            Candidate
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Prepare CV & apply
                                        </span>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-3.5 transition-colors ${
                                            accountType === 'employer'
                                                ? 'border-primary bg-primary/5 text-foreground'
                                                : 'border-border text-muted-foreground hover:bg-muted/40'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="account_type"
                                            value="employer"
                                            checked={accountType === 'employer'}
                                            onChange={() =>
                                                setAccountType('employer')
                                            }
                                            className="sr-only"
                                        />
                                        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                            <Building2
                                                className="size-4 text-primary"
                                                aria-hidden="true"
                                            />
                                            Employer
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Post jobs & review
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description:
        'Choose your role and enter your details to create your account',
};
