import { Octokit } from "octokit";
import { generateRepoDescription } from "./ai-github";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getGithubRepos() {
    try {
    const { data: repos } = await octokit.rest.repos.listForUser({
        username: "zyelda",
        sort: "updated",
        per_page: 6,
        type: "owner"
    });

    const processedRepos = await Promise.all(
        repos.map(async (repo) => {
        
        const aiDescription = await generateRepoDescription(repo.name, repo.description);

        return {
            id: repo.id,
            title: repo.name.replace(/-/g, " ").toUpperCase(),
            original_desc: repo.description,
            description: aiDescription,
            tech_stack: [repo.language].filter(Boolean),
            repo_link: repo.html_url,
            demo_link: repo.homepage,
            stars: repo.stargazers_count,
            last_updated: new Date(repo.pushed_at!).toLocaleDateString("id-ID", {
                day: "numeric", month: "short", year: "numeric"
            }),
            topics: repo.topics,
        };
        })
    );

    return processedRepos;
    } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return [];
    }
}