import { Agent, run } from '@openai/agents';
import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const outputType = z.object({
  url: z.string().describe('The URL of the playlist or video'),
  title: z.string().describe('The title of the playlist or video'),
  description: z.string().describe('The description of the playlist or video'),
  category: z
    .string()
    .describe(
      'The category of the playlist or video based on its title and description',
    ),
});

export async function POST(req: NextRequest) {
  try {
     const body = await req.json();   // ✅ this is the key

    console.log('Received query:', body);

    const agent = new Agent({
      name: 'YT Feed generator',
      instructions: `

        You are a YT Feed generator. Your task is to give me top 10 playlists or videos or you can give me a mix of both based on the query which i will provide you. You will give me the exact url of that playlist or video. Along with their name and description if available in the form of array of objects.

        I have some data, based on this data you have to give me the output

        Example data:

        [
            {
                question: "What do you want to achieve?",
                "user_response": "Get a job"
            },
            {
                question: "What is your current level?",
                "user_response": "Beginner"
            },
            {
                question: "What topics interest you?",
                "user_response": ["Web Development", "Data Structures & Algorithms"]
            },
            {
                question: "Have you built anything before?",
                "user_response": "Followed tutorials"
            },
            {
                question: "What are you struggling with?",
                "user_response": ["Staying consistent", "Understanding concepts"]
            }
        
        ]


        Response format:

        [
            {
                url : "<playlist or video url>",
                title: "<title>",
                description: "<description>",
                category: "<category>"
            }
        ]

        Read the data carefully and give me the best possible output based on that. Always try to give me a mix of both playlists and videos. Always give me the url of the playlist or video. Always give me the title of the playlist or video. Always give me the description of the playlist or video if available. Always give me the category of the playlist or video based on its title and description.
    
    `,
      outputType: outputType,
    });

    const result = await run(agent, body);
    return NextResponse.json(
      {
        message: 'success',
        data: result.finalOutput,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in agent execution:', error);
    return NextResponse.json(
      {
        message: 'error',
        data: { error: 'Something went wrong' },
      },
      { status: 500 },
    );
  }
}
