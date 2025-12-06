'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentGenerationSchema, ContentGenerationInput, GeneratedContentResponse } from '@/lib/types';
import styles from './Dashboard.module.css';
import { Loader2, Send, Edit, FileText, Twitter, Sparkles, History, CheckCircle } from 'lucide-react';
import { Post } from '@prisma/client';
import ReactMarkdown from 'react-markdown';
import { useContentGenerator } from '@/hooks/useContentGenerator';
import { usePosters } from '@/hooks/usePosters';
import { motion, AnimatePresence } from 'framer-motion';

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
    resolver: zodResolver(ContentGenerationSchema) as any,
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
        await postToNote({ title: noteTitle, body: noteBody }); 
        alert('Successfully posted to Note!');
    } catch (e: any) {
         alert('Failed to post to Note: ' + e.message);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <motion.section 
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.inputGroup}>
            <div>
                <label className={styles.label}>Topic</label>
                <input 
                    {...register('topic')} 
                    placeholder="What should we write about today?"
                    disabled={isGenerating}
                />
                {errors.topic && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.topic.message}</span>}
            </div>

            <div>
                 <label className={styles.label}>Tone</label>
                 <select {...register('tone')} disabled={isGenerating} className={styles.select}>
                    <option value="casual">Casual & Friendly</option>
                    <option value="professional">Professional & Crisp</option>
                    <option value="controversial">Bold & Controversial</option>
                    <option value="storytelling">Storytelling & Emotional</option>
                 </select>
            </div>

            <div className={styles.buttonGroup}>
                <button type="submit" disabled={isGenerating} className={styles.generateBtn}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                    {isGenerating ? 'Dreaming up content...' : 'Generate Magic'}
                </button>
            </div>
        </form>
      </motion.section>

      <AnimatePresence>
        {content && (
            <motion.section 
                className={styles.resultsGrid}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
            >
                {/* Note Column */}
                <div className={styles.resultColumn}>
                    <div className={styles.columnHeader}>
                        <FileText className={styles.columnIcon} /> Note Article
                    </div>
                    <div className={`${styles.card} ${styles.previewCard}`}>
                        <div className={styles.inputGroup}>
                            <input 
                                value={noteTitle} 
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="Article Title"
                                style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                            />
                            
                            <div className={styles.tabs}>
                                <button 
                                    className={`${styles.tabBtn} ${noteTab === 'edit' ? styles.active : ''}`}
                                    onClick={() => setNoteTab('edit')}
                                >
                                    write
                                </button>
                                <button 
                                    className={`${styles.tabBtn} ${noteTab === 'preview' ? styles.active : ''}`}
                                    onClick={() => setNoteTab('preview')}
                                >
                                    preview
                                </button>
                            </div>

                            {noteTab === 'edit' ? (
                                <textarea 
                                    value={noteBody}
                                    onChange={(e) => setNoteBody(e.target.value)}
                                    className={styles.textArea}
                                    style={{ minHeight: '400px' }}
                                />
                            ) : (
                                <div className={`${styles.textArea} ${styles.markdownContent}`} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                    <ReactMarkdown>{noteBody}</ReactMarkdown>
                                </div>
                            )}

                             <button 
                                onClick={handlePostNote} 
                                disabled={isPostingNote}
                                className={`${styles.actionBtn} ${styles.postBtn}`}
                             >
                                {isPostingNote ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                {isPostingNote ? 'Publishing...' : 'Publish to Note'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* X Column */}
                <div className={styles.resultColumn}>
                    <div className={styles.columnHeader}>
                        <Twitter className={styles.columnIcon} /> X (Twitter) Post
                    </div>
                     <div className={`${styles.card} ${styles.previewCard}`}>
                        <textarea 
                            value={xPost}
                            onChange={(e) => setXPost(e.target.value)}
                            className={styles.textArea}
                            style={{ minHeight: '200px' }}
                            placeholder="Your viral tweet..."
                        />
                         <button 
                            onClick={handlePostX} 
                            disabled={isPostingX}
                             className={`${styles.actionBtn} ${styles.postBtn}`}
                         >
                            {isPostingX ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                            {isPostingX ? 'Tweeting...' : 'Post to X'}
                        </button>
                     </div>
                </div>
            </motion.section>
        )}
      </AnimatePresence>

        {history.length > 0 && (
            <motion.section 
                className={`${styles.card} ${styles.historyCard}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className={styles.historyHeader}>
                    <History /> Recent Generations
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Topic</th>
                                <th>Status</th>
                                <th>Links</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(post => (
                                <tr key={post.id}>
                                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 500, color: 'white' }}>{post.topic || 'No topic'}</td>
                                    <td>
                                        <span className={`${styles.statusTag} ${post.status?.includes('PUBLISHED') ? styles.statusPublished : ''}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.linkGroup}>
                                            {post.noteUrl && <a href={post.noteUrl} target="_blank" className={styles.link}>Note</a>}
                                            {post.xUrl && <a href={post.xUrl} target="_blank" className={styles.link}>X</a>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        )}
    </div>
  );
}
