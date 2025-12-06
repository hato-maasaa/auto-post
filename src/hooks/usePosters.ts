import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const usePosters = () => {
    const [isPostingX, setIsPostingX] = useState(false);
    const [isPostingNote, setIsPostingNote] = useState(false);
    const router = useRouter();

    const postToX = async (text: string) => {
        setIsPostingX(true);
        try {
            const res = await fetch('/api/post/x', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!res.ok) throw new Error('Failed to post to X');
            router.refresh(); 
            return true;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            setIsPostingX(false);
        }
    };

    const postToNote = async ({ title, body }: { title: string; body: string }) => {
        setIsPostingNote(true);
        try {
             const res = await fetch('/api/post/note', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, body })
            });
            if (!res.ok) throw new Error('Failed to post to Note');
            router.refresh();
            return true;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            setIsPostingNote(false);
        }
    };

    return { postToX, isPostingX, postToNote, isPostingNote };
}
