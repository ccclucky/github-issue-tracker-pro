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
  body: string; // Issue description
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

export interface UserNote {
  name: string;      // 1. 称呼
  role: string;      // 2. 团队角色
  motivation: string;// 3. 参与动机
  hasIdea: boolean;  // 4. 有无 idea
  ideaDetails: string; // idea 详情
  other: string;     // 5. 其他
}

export interface NotesMap {
  [issueId: number]: UserNote;
}
