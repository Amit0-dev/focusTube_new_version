'use client';

import Container from '@/components/common/Container';
import { useSignUp } from '@clerk/nextjs/legacy';
import { Button, InputOTP, Label, Link } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Verify = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { signUp, isLoaded, setActive } = useSignUp();

  if (!isLoaded) return null;

  const verify = async () => {
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: value,
      });

      if (result.status !== 'complete') {
        setError('Verification failed. Please check the code and try again.');
        return;
      }

      if (result.status === 'complete') {
        await setActive({
          session: result.createdSessionId,
        });

        router.push('/dashboard');
      }
    } catch (error: any) {
      console.log(
        error.errors[0].message || 'An error occurred during verification',
      );
      setError('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="w-full h-screen">
      <Container className="w-full h-full flex-col flex items-center justify-center">
        <div className="flex w-70 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label className="text-xl font-semibold">Verify account</Label>
            <p className="text-sm text-muted">
              We&apos;ve sent a code to your email. Please enter the code below
              to verify your account.
            </p>
          </div>
          <InputOTP maxLength={6} value={value} onChange={setValue}>
            <InputOTP.Group>
              <InputOTP.Slot index={0} className="bg-neutral-300" />
              <InputOTP.Slot index={1} className="bg-neutral-300" />
              <InputOTP.Slot index={2} className="bg-neutral-300" />
            </InputOTP.Group>
            <InputOTP.Separator />
            <InputOTP.Group>
              <InputOTP.Slot index={3} className="bg-neutral-300" />
              <InputOTP.Slot index={4} className="bg-neutral-300" />
              <InputOTP.Slot index={5} className="bg-neutral-300" />
            </InputOTP.Group>
          </InputOTP>

          <div className="flex items-center gap-1.25 px-1 pt-1">
            <p className="text-sm text-muted">Didn&apos;t receive a code?</p>
            <Link className="text-foreground underline" href="#">
              Resend
            </Link>
          </div>
        </div>

        <Button
          onClick={verify}
          variant="primary"
          className={'bg-orange-400 text-white font-semibold mt-10 px-6 py-2'}
        >
          Verify
        </Button>

        <p className="text-red-500 text-sm font-medium mt-5">{error}</p>
      </Container>
    </div>
  );
};

export default Verify;
