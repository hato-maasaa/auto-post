import { NextResponse } from 'next/server';
import { ContentGenerationSchema } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = ContentGenerationSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { topic, tone, targetAudience, keyPoints } = result.data;

    // In a real app, call OpenAI/Anthropic/Gemini here.
    // For MVP/Demo purposes, we generate mock content.

    const noteTitle = `Why ${topic} will change your life`;
    const noteBody = `
# Introduction

${topic} is becoming increasingly important for ${targetAudience || 'everyone'}.

## Main Points

${keyPoints ? keyPoints.split('\n').map(p => `- ${p}`).join('\n') : '- Point 1\n- Point 2'}

## Conclusion

This is a ${tone} take on the matter. Hope you enjoyed it!
    `.trim();
    
    const xPosts = [
        `Just fully realized how important ${topic} is! 🚀\n\nIf you are ${targetAudience || 'anyone'}, you need to see this. #${topic.replace(/\s+/g, '')} #Tips`,
        `1/3 Here is why ${topic} matters... 👇`,
        `2/3 It really impacts your workflow by...`,
        `3/3 Summary: Just do it. \n\nRead more in my note! (Link below)`
    ];

    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
        noteTitle,
        noteBody,
        xPosts
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
