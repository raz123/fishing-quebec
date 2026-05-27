#!/usr/bin/env node
// Creates the fishing-quebec repo on GitHub and pushes the local code.
// Usage: GITHUB_TOKEN=ghp_xxx node scripts/setup-github.mjs

const REPO_NAME = 'fishing-quebec';
const REPO_DESC = 'Interactive map of fishing spots and pourvoiries across Quebec with species info, equipment recommendations, and Amazon affiliate links.';

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log(`
To create the GitHub repo automatically, you need a GitHub Personal Access Token.

1. Go to https://github.com/settings/tokens?type=beta
2. Generate a new fine-grained token with "Repository" permissions (read/write)
3. Run:

   set GITHUB_TOKEN=ghp_xxx
   node scripts/setup-github.mjs

Or create the repo manually:
1. Go to https://github.com/new
2. Repository name: ${REPO_NAME}
3. Description: ${REPO_DESC}
4. Public, no template, no README, no .gitignore, no license
5. Click "Create repository"
6. Then run:
   git remote add origin https://github.com/raz123/${REPO_NAME}.git
   git push -u origin main
`);
    process.exit(0);
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  // Create the repo
  const res = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: REPO_NAME,
      description: REPO_DESC,
      private: false,
      auto_init: false,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Failed to create repo: ${res.status}\n${body}`);
    process.exit(1);
  }

  console.log(`Repository created: https://github.com/raz123/${REPO_NAME}`);
  console.log('Now push the local code:');
  console.log(`
  git remote add origin https://github.com/raz123/${REPO_NAME}.git
  git push -u origin main
`);
}

main();
