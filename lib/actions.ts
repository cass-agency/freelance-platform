"use server";

export interface SubmitIdeaResult {
  success: boolean;
  issueUrl?: string;
  issueNumber?: number;
  error?: string;
}

export async function submitIdea(formData: FormData): Promise<SubmitIdeaResult> {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  if (!title) return { success: false, error: "Title is required" };
  if (!description || description.length < 30)
    return { success: false, error: "Description must be at least 30 characters" };

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { success: false, error: "GitHub token not configured. Contact the admin." };
  }

  const body = `## Idea\n\n${description}\n\n**Category:** ${category || "Other"}\n\n---\n*Submitted via Cass Open Source Platform*`;

  const res = await fetch("https://api.github.com/repos/cass-agency/ideas/issues", {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      title,
      body,
      labels: ["idea"],
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { success: false, error: data.message ?? "Failed to submit idea. Try again later." };
  }

  const issue = await res.json();
  return { success: true, issueUrl: issue.html_url, issueNumber: issue.number };
}
