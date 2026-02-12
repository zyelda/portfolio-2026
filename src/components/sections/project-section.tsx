import { getGithubRepos } from "@/lib/github-fetcher";
import ProjectClientView, { Project } from "@/components/ui/project-card-client"; 

export default async function ProjectSection() {
    const rawData = await getGithubRepos(); 

    const projects = rawData as unknown as Project[];

    return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Live Repositories</h2>
        <p className="text-muted-foreground max-w-2xl">
            Repository ini diambil <strong>secara real-time</strong> dari GitHub saya.
            Deskripsi disempurnakan otomatis oleh <strong>Groq AI</strong>.
        </p>
        </div>

        <ProjectClientView projects={projects} />

    </section>
    );
}