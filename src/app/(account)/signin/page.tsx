								'use client';
								
								import Button from '@/components/Button';
								import ControlledField from '@/components/ControlledField';
								import FancyRectangle from '@/components/FancyRectangle';
								import { useSignIn } from '@clerk/clerk-react';
								import { zodResolver } from '@hookform/resolvers/zod';
								import Link from 'next/link';
								import { useRouter } from 'next/navigation';
								import { useState } from 'react';
								import { useForm } from 'react-hook-form';
								import { FcGoogle } from 'react-icons/fc';
								import { z } from 'zod';
								import { handleClerkErrors } from '../helpers';
								import { emailSchema } from '../schemas';
								
								// export const metadata: Metadata = {
								//     title: 'Sign In',
								// };
								
								const signInSchema = z.object({
                            email: emailSchema,
                            password: z.string().min(1, { message: 'Please enter your password' }),
								});
								
								export default function SignInPage() {
                            const { isLoaded, signIn, setActive } = useSignIn();
								
                            const form = useForm<z.infer<typeof signInSchema>>({
                        defaultValues: { email: '', password: '' },
                        resolver: zodResolver(signInSchema),
                            });
								
                            const [signInLoading, setSignInLoading] = useState(false);
								
                            const router = useRouter();
                            const handleSignIn = form.handleSubmit(async ({ email, password }) => {
                        if (!isLoaded) return;
								
                        setSignInLoading(true);
								
                        try {
                    const result = await signIn.create({
                identifier: email,
                password,
                    });
								
                    if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push('/');
                router.refresh();
                    } else {
                console.log(result);
                    }
                        } catch (error) {
                    handleClerkErrors(error, form, [
                {
            code: 'form_identifier_not_found',
            field: 'email',
            message: "Can't find your account.",
                },
                {
            code: 'form_password_incorrect',
            field: 'password',
            message: 'Password is incorrect. Try again, or use another method.',
                },
                {
            code: 'strategy_for_user_invalid',
            field: 'password',
            message:
        'Account is not set up for password sign-in. Please sign in with Google.',
                },
                    ]);
                        }
								
                        setSignInLoading(false);
                            });
								
                            const handleGoogleSignIn = async () => {
                        if (!isLoaded) return;
                        try {
                    await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
                    });
                        } catch (error) {
                    // Handle any errors that might occur during the sign-in process
                    console.error('Google Sign-In Error:', error);
                        }
                            };
								
                            return (
                        <section className="flex justify-center">
                    <FancyRectangle colour="purple" offset="8" filled={true}>
                <div className="z-0 w-[24rem] border-4 border-black bg-white px-8 py-8 text-black md:w-[32rem] md:px-12 md:py-12">
            {/* Heading */}
            <h3 className="text-3xl font-bold">Sign In</h3>
            <p className="mb-8 text-xl">Sign into your account</p>
								
            <Button
        onClick={handleGoogleSignIn}
        colour="white"
        width="w-[19rem] md:w-[25.5rem]"
            >
        <FcGoogle className="mr-2 inline-block text-xl" /> Continue with Google
            </Button>
								
            <div className="my-6 mt-10 flex items-center justify-center">
        <div className="w-full border-t border-grey"></div>
        <p className="mx-4 text-grey">or</p>
        <div className="w-full border-t border-grey"></div>
            </div>
            <form onSubmit={handleSignIn}>
        <ControlledField label="Email" control={form.control} name="email" />
        <ControlledField
    label="Password"
    control={form.control}
    name="password"
    type="password"
        />
        <Link
    href="/forgot-password"
    className="mb-8 flex text-lg text-orange md:text-base"
        >
    Forgot password?
        </Link>
        <Button
    type="submit"
    colour="orange"
    width="w-[19rem] md:w-[25rem]"
    loading={signInLoading}
        >
    Sign In
        </Button>
            </form>
								
            {/* Sign-up option */}
            <div className="mt-10 flex">
        <p className="text-lg text-grey md:text-base">
    Don&apos;t have an account yet?{' '}
    <Link href="/join" className="text-orange">
Join Us
    </Link>
        </p>
            </div>
                </div>
                    </FancyRectangle>
                        </section>
                            );
								}
								