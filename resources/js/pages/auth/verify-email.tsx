import { Form, Head } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { logout } from '@/routes';

type Props = {
    status?: string;
};

export default function VerifyEmail({ status }: Props) {
    return (
        <>
            <Head title="Verify Email" />

            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                        <MailCheck className="size-8" aria-hidden="true" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Verify your email address
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Thanks for signing up for Aptivra! Before getting
                        started, please verify your personal email address by
                        clicking on the link we just emailed to you.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center text-sm font-medium text-primary">
                        A new verification link has been sent to the email
                        address you provided during registration.
                    </div>
                )}

                <Form
                    action="/email/verification-notification"
                    method="post"
                    className="space-y-4"
                >
                    {({ processing }) => (
                        <>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                Resend verification email
                            </Button>

                            <div className="text-center">
                                <TextLink
                                    href={logout()}
                                    method="post"
                                    as="button"
                                    className="text-sm"
                                >
                                    Log out
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
