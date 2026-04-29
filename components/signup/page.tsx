'use client';

import { useSignUp } from '@clerk/nextjs/legacy';
import { Button, Card, Link } from '@heroui/react';
import { Form, Input, Label, TextField } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const SignupForm = () => {
  const SignupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(
      ['Learner', 'Creator'],
      "Role must be either 'Learner' or 'Creator'",
    ),
  });

  type SignupFormData = z.infer<typeof SignupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      await signUp?.create({
        emailAddress: data.email,
        firstName: data.name,
        password: data.password,
        unsafeMetadata: {
          role: data.role,
        },
      });

      await signUp?.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      // redirect to the verification page

      router.push('/verify');
    } catch (error: any) {
      console.log(
        error.errors[0].message || 'An error occurred during sign up',
      );
    }
  };

  return (
    <Card className="w-full max-w-md bg-background-secondary">
      <Card.Header>
        <Card.Title className="text-foreground-muted">Sign Up</Card.Title>
        <Card.Description>Create a new account to get started</Card.Description>
      </Card.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField name="name" type="name">
              <Label className="text-foreground-muted">Full Name</Label>
              <Input
                placeholder="Enter your full name"
                variant="secondary"
                className={'bg-neutral-300'}
                {...register('name')}
              />
              <p className="text-red-500 font-normal text-xs">
                {errors.name?.message}
              </p>
            </TextField>

            <TextField name="email" type="email">
              <Label className="text-foreground-muted">Email</Label>
              <Input
                placeholder="email@example.com"
                variant="secondary"
                className={'bg-neutral-300'}
                {...register('email', { required: true })}
              />
              <p className="text-red-500 font-normal text-xs">
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
              <p className="text-red-500 font-normal text-xs">
                {errors.password?.message}
              </p>
            </TextField>

            <TextField name="role">
              <Label className="text-foreground-muted">Role</Label>

              <select
                className="mt-1 w-full rounded-lg px-3 py-2 border-neutral-300 border placeholder:text-neutral-500 focus:outline-none"
                {...register('role', { required: true })}
              >
                <option
                  value=""
                  className="bg-background text-foreground-muted"
                >
                  Select role
                </option>
                <option
                  value="Learner"
                  className="bg-background text-foreground-muted"
                >
                  Learner
                </option>
                <option
                  value="Creator"
                  className="bg-background text-foreground-muted"
                >
                  Creator
                </option>
              </select>

              <p className="text-red-500 text-xs mt-1">
                {errors.role?.message}
              </p>
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer className="mt-4 flex flex-col gap-2">
          <Button
            className="w-full bg-foreground text-background"
            type="submit"
            isDisabled={false}
          >
            {/* {isSigningUp ? "Signing Up..." : "Sign Up"} */}
            Sign Up
          </Button>

          <p className="text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link className="hover:underline text-foreground" href="/signin">
              Log in
            </Link>
          </p>
        </Card.Footer>
      </Form>
    </Card>
  );
};

export default SignupForm;
