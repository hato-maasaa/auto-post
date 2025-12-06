import { useState } from 'react';
import { ContentGenerationInput, GeneratedContentResponse } from '@/lib/types';

export const useContentGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (data: ContentGenerationInput): Promise<GeneratedContentResponse | null> => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Generation failed');
      return await res.json();
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateContent, isGenerating, error };
};
