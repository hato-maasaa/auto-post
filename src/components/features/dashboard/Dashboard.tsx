'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentGenerationSchema, ContentGenerationInput, GeneratedContentResponse } from '@/lib/types';
import styles from './Dashboard.module.css';
import { Loader2, Send, Edit, FileText, Twitter, Sparkles, History } from 'lucide-react';
import { Post } from '@prisma/client';
import ReactMarkdown from 'react-markdown';
import { useContentGenerator } from '@/hooks/useContentGenerator';
import { usePosters } from '@/hooks/usePosters';

interface DashboardProps {
  history: Post[];
}

export default function Dashboard({ history }: DashboardProps) {
  const [content, setContent] = useState<GeneratedContentResponse | null>(null);
  
  // Custom Hooks for Logic / API encapsulation
  const { generateContent, isGenerating } = useContentGenerator();
  const { postToX, isPostingX, postToNote, isPostingNote } = usePosters();

  // States for edited content
  const [noteBody, setNoteBody] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [xPost, setXPost] = useState(""); 
  const [noteTab, setNoteTab] = useState<'edit' | 'preview'>('edit');

  const { register, handleSubmit, formState: { errors } } = useForm<ContentGenerationInput>({
    resolver: zodResolver(ContentGenerationSchema),
    defaultValues: {
        tone: 'casual'
    }
  });

  const onSubmit = async (data: ContentGenerationInput) => {
    const result = await generateContent(data);
    if (result) {
        setContent(result);
        setNoteBody(result.noteBody);
        setNoteTitle(result.noteTitle);
        setXPost(result.xPosts.join('\n\n--- THREAD SPLIT ---\n\n')); 
    } else {
        alert('Failed to generate content.');
    }
  };

  const handlePostX = async () => {
    try {
        await postToX(xPost);
        alert('Successfully posted to X!');
    } catch (e: any) {
        alert('Failed to post to X: ' + e.message);
    }
  };
  
   const handlePostNote = async () => {
     try {
        await postToNote(noteTitle, noteBody);
        alert('Successfully posted to Note! (Check browser window if visible)');
    } catch (e: any) {
        alert('Failed to post to Note: ' + e.message);
    }
  };

  return (
    <div className={styles.container}>
        <section className={`glass-panel ${styles.section} ${styles.formSection}`}>
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-[hsl(var(--primary))]" />
                <h2 className="text-xl font-bold">Input Idea</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Topic / Title Idea</label>
                  <input {...register('topic')} placeholder="e.g. Benefits of waking up early" />
                  {errors.topic && <p className="text-red-400 text-sm mt-1">{errors.topic.message}</p>}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium mb-1">Target Audience</label>
                      <input {...register('targetAudience')} placeholder="e.g. Freelance engineers" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium mb-1">Tone</label>
                      <select {...register('tone')}>
                          <option value="casual">Casual (Friendly)</option>
                          <option value="polite">Polite (Business)</option>
                          <option value="emotional">Emotional (Storytelling)</option>
                          <option value="professional">Professional (Authoritative)</option>
                      </select>
                   </div>
               </div>

               <div>
                  <label className="block text-sm font-medium mb-1">Key Points / Details</label>
                  <textarea {...register('keyPoints')} rows={4} placeholder="- Improved productivity&#10;- Better mental health" />
               </div>

               <div className="flex justify-end">
                   <button type="submit" className="btn btn-primary" disabled={isGenerating}>
                     {isGenerating ? 'Generating...' : 'Generate Content'}
                     {isGenerating && <Loader2 className={styles.spinner} />}
                   </button>
               </div>
            </form>
        </section>
        
        {content && (
            <section className={styles.outputGrid + " animate-fade-in"}>
                {/* Note Area */}
                <div className={`glass-panel ${styles.section} ${styles.editorContainer}`}>
                   <div className="flex justify-between items-center mb-2">
                       <h2 className={styles.editorTitle}><FileText size={20} /> Note Editor</h2>
                       <div className="flex bg-black/20 rounded-lg p-1">
                           <button 
                             onClick={() => setNoteTab('edit')} 
                             className={`px-3 py-1 rounded-md text-sm transition-colors ${noteTab === 'edit' ? 'bg-[hsl(var(--primary))] text-white' : 'hover:bg-white/10'}`}
                           >Edit</button>
                           <button 
                             onClick={() => setNoteTab('preview')} 
                             className={`px-3 py-1 rounded-md text-sm transition-colors ${noteTab === 'preview' ? 'bg-[hsl(var(--primary))] text-white' : 'hover:bg-white/10'}`}
                           >Preview</button>
                       </div>
                   </div>

                    <input 
                        value={noteTitle} 
                        onChange={e => setNoteTitle(e.target.value)} 
                        placeholder="Note Title" 
                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}
                    />
                   <div style={{ flex: 1, minHeight: '300px' }}>
                    {noteTab === 'edit' ? (
                        <textarea
                            className={styles.textarea}
                            style={{ height: '100%', border: 'none', background: 'transparent' }}
                            value={noteBody}
                            onChange={e => setNoteBody(e.target.value)}
                            placeholder="Markdown content..."
                        />
                    ) : (
                        <div className="markdown-preview p-4 h-full overflow-y-auto border border-white/10 rounded bg-black/20">
                            <ReactMarkdown>{noteBody}</ReactMarkdown>
                        </div>
                    )}
                   </div>
                   <div className={styles.actions}>
                      <button className="btn btn-primary" onClick={handlePostNote} disabled={isPostingNote}>
                        Post to Note
                        {isPostingNote && <Loader2 className={styles.spinner} />}
                      </button>
                   </div>
                </div>
                
                 {/* X Area */}
                <div className={`glass-panel ${styles.section} ${styles.editorContainer}`}>
                   <h2 className={styles.editorTitle}><Twitter size={20} /> X Editor</h2>
                   <p className="text-xs opacity-60 mb-2">Use "--- THREAD SPLIT ---" to separate tweets in a thread.</p>
                   <textarea
                     className={`${styles.textarea} ${styles.shortTextarea}`}
                     value={xPost}
                     onChange={e => setXPost(e.target.value)}
                   />
                    <div className="text-right text-sm opacity-50">
                        {xPost.length} chars
                    </div>
                   <div className={styles.actions}>
                      <button className="btn btn-primary" onClick={handlePostX} disabled={isPostingX || content.xPosts.length === 0}>
                        Post to X
                        {isPostingX && <Loader2 className={styles.spinner} />}
                      </button>
                   </div>
                </div>
            </section>
        )}

        {/* History Section */}
        {history.length > 0 && (
             <section className={`glass-panel ${styles.section} animate-fade-in`}>
                <div className="flex items-center gap-2 mb-4">
                    <History className="text-[hsl(var(--primary))]" />
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-wider opacity-70">
                                <th className="p-3">Date</th>
                                <th className="p-3">Topic</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Links</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(post => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 opacity-70">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3 font-medium">{post.topic || 'No topic'}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${post.status?.includes('PUBLISHED') ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-3 flex gap-3">
                                        {post.noteUrl && <a href={post.noteUrl} target="_blank" className="text-blue-400 hover:text-blue-300 underline">Note</a>}
                                        {post.xUrl && <a href={post.xUrl} target="_blank" className="text-blue-400 hover:text-blue-300 underline">X</a>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        )}
    </div>
  );
}
