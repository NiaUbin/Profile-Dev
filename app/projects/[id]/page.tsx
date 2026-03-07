import ClientProjectDetailPage from './ClientPage';
import { getProjects } from '@/lib/firestore';

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({
      id: p.id,
    }));
  } catch (error) {
    console.warn("Could not fetch projects for static generation, returning []", error);
    return [];
  }
}

export default function ProjectDetailPage() {
  return <ClientProjectDetailPage />;
}
