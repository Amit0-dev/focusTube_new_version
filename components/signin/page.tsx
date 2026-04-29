'use client';

import { useSignIn } from '@clerk/nextjs/legacy';
import { Button, Card, Link } from '@heroui/react';
import { Form, Input, Label, TextField } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const SigninForm = () => {
  const signinSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  type SigninFormData = z.infer<typeof signinSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
  });

  const [error, setError] = useState<string>('');
  const { signIn, isLoaded, setActive } = useSignIn();

  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
    try {
      const result = await signIn?.create({
        identifier: data.email,
        password: data.password,
      });

      if (result?.status !== 'complete') {
        setError(
          'Sign in failed. Please check your credentials and try again.',
        );
        return;
      }

      if (result?.status === 'complete') {
        await setActive({
          session: result.createdSessionId,
        });

        router.push('/dashboard');
      }
    } catch (error: any) {
      console.log(
        error.errors[0].message || 'An error occurred during sign in',
      );
      setError(error.errors[0].message || 'An error occurred during sign in');
    }
  };

  return (
    <Card className="w-full max-w-md bg-background-secondary">
      <Card.Header>
        <Card.Title className="text-foreground-muted">Login</Card.Title>
        <Card.Description>
          Enter your credentials to access your account
        </Card.Description>
      </Card.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField name="email" type="email">
              <Label className="text-foreground-muted">Email</Label>
              <Input
                placeholder="email@example.com"
                variant="secondary"
                className={'bg-neutral-300'}
                {...register('email', { required: true })}
              />
              <p className="font-normal text-red-500 text-xs">
                {errors.email?.message}
              </p>
            </TextField>
            <TextField name="password" type="password">
              <Label className="text-foreground-muted">Password</Label>
              <Input
                placeholder="••••••••"
                variant="secondary"
                className={'bg-neutral-300'}
                {...register('password', { required: true })}
              />
              <p className="font-normal text-red-500 text-xs">
                {errors.password?.message}
              </p>
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer className="mt-6 flex flex-col gap-2">
          <Button
            className="w-full bg-foreground text-background"
            type="submit"
            isDisabled={false}
          >
            {/* {isLoggingIn ? 'Signing...' : 'Sign In'} */}
            Sign In
          </Button>

          {error && (
            <p className="text-red-500 text-xs text-center mt-2">{error}</p>
          )}

          <Link className="text-center text-sm text-gray-400" href="#">
            Forgot password?
          </Link>

          <p className="text-center text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link className="hover:underline text-foreground" href="/signup">
              Sign up
            </Link>
          </p>
        </Card.Footer>
      </Form>
    </Card>
  );
};

export default SigninForm;
