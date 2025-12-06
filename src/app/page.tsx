import Dashboard from '@/components/features/dashboard/Dashboard';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const history = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <main className={styles.main}>
        <header className={styles.header}>
            <h1 className={styles.title}>
                One Source, Two Posts
            </h1>
            <p className={styles.subtitle}>
                たった一つのアイデアから、「売れるNote」と「バズるXポスト」を同時生成。
            </p>
        </header>

        <Dashboard history={history} />
    </main>
  );
}
