import { GithubIssue, RepoConfig } from '../types';

const BASE_URL = 'https://api.github.com';

export const fetchIssuesFromGithub = async (
  config: RepoConfig,
  page: number = 1,
  perPage: number = 10
): Promise<GithubIssue[]> => {
  const { owner, repo, token } = config;
  
  if (!owner || !repo) {
    throw new Error("Repository information missing");
  }

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  // Adding a timestamp to prevent browser caching for the polling mechanism
  const url = `${BASE_URL}/repos/${owner}/${repo}/issues?state=all&sort=updated&direction=desc&page=${page}&per_page=${perPage}&_t=${Date.now()}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 404) throw new Error("仓库未找到 (404)");
    if (response.status === 403) throw new Error("API 速率限制已达上限 (403)，请配置 Token");
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
};

export const fetchAllIssuesFromGithub = async (config: RepoConfig): Promise<GithubIssue[]> => {
  let allIssues: GithubIssue[] = [];
  let page = 1;
  const perPage = 100; // Maximize per page to reduce requests

  while (true) {
    const issues = await fetchIssuesFromGithub(config, page, perPage);
    if (issues.length === 0) break;
    
    allIssues = [...allIssues, ...issues];
    
    // If we got fewer issues than perPage, we've reached the last page
    if (issues.length < perPage) break;
    
    page++;
  }

  return allIssues;
};
