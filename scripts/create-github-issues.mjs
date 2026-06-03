import fs from "node:fs/promises";
import path from "node:path";

const owner = process.env.GITHUB_OWNER ?? "rhz1994";
const repo = process.env.GITHUB_REPO ?? "CityQuest";
const token = process.env.GITHUB_TOKEN;
const dryRun = process.env.DRY_RUN !== "0";
const issuesDir = path.join(process.cwd(), "docs", "issues");

if (!token && !dryRun) {
  throw new Error("Set GITHUB_TOKEN before creating issues.");
}

const parseIssueFile = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Issue file is missing frontmatter.");
  }

  const frontmatter = match[1];
  const body = match[2].trim();
  const title = frontmatter.match(/^title:\s*"(.+)"$/m)?.[1];
  const labelsBlock = frontmatter.match(/^labels:\n((?:\s+- .+\n?)+)/m)?.[1] ?? "";
  const labels = labelsBlock
    .split("\n")
    .map((line) => line.trim().replace(/^- /, ""))
    .filter(Boolean);

  if (!title) {
    throw new Error("Issue file is missing title.");
  }

  return { title, labels, body };
};

const files = (await fs.readdir(issuesDir))
  .filter((file) => /^\d+-.+\.md$/.test(file))
  .sort();

for (const file of files) {
  const content = await fs.readFile(path.join(issuesDir, file), "utf8");
  const issue = parseIssueFile(content);

  if (dryRun) {
    console.log(`[dry-run] ${issue.title} (${issue.labels.join(", ")})`);
    continue;
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(issue),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not create ${file}: ${response.status} ${errorText}`);
  }

  const created = await response.json();
  console.log(`created ${created.html_url}`);
}
