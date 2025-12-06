import { NextResponse } from 'next/server';
import { NotePoster } from '@/lib/note-poster';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, body } = await req.json();

    const poster = new NotePoster();
    // This will open a browser window on the server/local machine!
    const result = await poster.post({ title, body });

    // Log to DB
    await prisma.post.create({
        data: {
             topic: title,
             generatedNote: body,
             noteUrl: result.url,
             status: 'PUBLISHED_NOTE'
        }
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("Note API Error:", error);
    return NextResponse.json({ error: 'Failed to post to Note' }, { status: 500 });
  }
}
