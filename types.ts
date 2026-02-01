export interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubLabel {
  id: number;
  name: string;
  color: string;
}

export interface GithubIssue {
  id: number;
  number: number;
  title: string;
  user: GithubUser;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
  labels: GithubLabel[];
  comments: number;
}

export interface RepoConfig {
  owner: string;
  repo: string;
  token?: string; // Optional PAT for higher rate limits
}

export interface ProcessedMap {
  [issueId: number]: boolean;
}
