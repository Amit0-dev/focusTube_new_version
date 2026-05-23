import prisma from '@/lib/prisma';
import { roleMap } from '@/utils/role';
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function POST(req: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;

    if (!WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Webhook secret is not configured.' },
        { status: 500 },
      );
    }

    const headersPayload = await headers();

    const svix_id = headersPayload.get('svix-id') ?? '';
    const svix_timestamp = headersPayload.get('svix-timestamp') ?? '';
    const svix_signature = headersPayload.get('svix-signature') ?? '';

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing required Svix headers.' },
        { status: 400 },
      );
    }

    const payload = await req.json();

    const body = JSON.stringify(payload);

    console.log('Received webhook payload:', body);

    const webhook = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = webhook.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid webhook signature.' },
        { status: 400 },
      );
    }

    console.log('Received event:', evt);

    const { type: eventType, data } = evt;

    console.log(`Event type: ${eventType}`);
    console.log('Event Id:', data.id);

    if (eventType === 'user.created') {
      try {
        const {
          email_addresses,
          primary_email_address_id,
          first_name,
          unsafe_metadata,
          id: userId,
        } = evt.data;

        const primaryEmail = email_addresses.find(
          (email) => email.id === primary_email_address_id,
        );

        if (!primaryEmail) {
          return NextResponse.json(
            { error: 'Primary email not found.' },
            { status: 400 },
          );
        }

        console.log('Primary Email:', primaryEmail?.email_address);

        console.log('First Name:', first_name);
        console.log('Unsafe Metadata:', unsafe_metadata);

        const rawRole = unsafe_metadata.role;

        if (!rawRole || typeof rawRole !== 'string') {
          throw new Error('Invalid role');
        }

        const normalizedRole = rawRole.toLowerCase();

        if (
          normalizedRole !== 'learner' &&
          normalizedRole !== 'creator' &&
          normalizedRole !== 'admin'
        ) {
          throw new Error('Invalid role');
        }

        const userRole = roleMap[normalizedRole];

        console.log('User Role:', userRole);

        if (!first_name || !userRole) {
          return NextResponse.json(
            { error: 'Missing required user information.' },
            { status: 400 },
          );
        }

        // create user in db

        const user = await prisma.user.create({
          data: {
            email: primaryEmail?.email_address,
            name: first_name,
            role: userRole,
            clerkUserId: userId,
          },
        });

        // add role in public metadata in clerk dashboard & remove from unsafe metadata

        const client = await clerkClient();

        const response = await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            role: userRole,
          },
          unsafeMetadata: {
            role: null,
          },
        });

        console.log('Clerk update response:', response.publicMetadata);

        console.log('User created in database:', user);
      } catch (error) {
        return NextResponse.json(
          { error: 'An error occurred while creating the user.' },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ message: 'User created successfully.' });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while processing the register webhook.' },
      { status: 500 },
    );
  }
}
