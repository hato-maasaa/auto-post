import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const appKey = process.env.TWITTER_APP_KEY;
    const appSecret = process.env.TWITTER_APP_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;

    let xUrl = "https://x.com/mock_user/status/123456789";
    const tweets = text.split('--- THREAD SPLIT ---').map((t: string) => t.trim()).filter((t: string) => t.length > 0);

    if (appKey && appSecret && accessToken && accessSecret) {
        const client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });

        if (tweets.length === 1) {
            const result = await client.v2.tweet(tweets[0]);
            xUrl = `https://twitter.com/user/status/${result.data.id}`;
        } else {
             const result = await client.v2.tweetThread(tweets);
             xUrl = `https://twitter.com/user/status/${result[0].data.id}`;
        }
    } else {
        console.warn("Twitter API keys missing. Mocking post.");
        // Simulate network request
        await new Promise(r => setTimeout(r, 1000));
    }

    // Simple logging
    await prisma.post.create({
        data: {
             topic: "X Post Only (Auto-log)",
             generatedX: text,
             xUrl: xUrl,
             status: 'PUBLISHED_X'
        }
    });

    return NextResponse.json({ success: true, url: xUrl });

  } catch (error) {
    console.error("X Post Error:", error);
    return NextResponse.json({ error: 'Failed to post to X' }, { status: 500 });
  }
}
