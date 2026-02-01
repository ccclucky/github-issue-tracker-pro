import { useState, useEffect, useCallback, useRef } from 'react';
import { GithubIssue, RepoConfig, ProcessedMap } from '../types';
import { fetchIssuesFromGithub } from '../services/github';

const STORAGE_KEY = 'github_issue_tracker_processed_v1';
const POLLING_INTERVAL = 30 * 60 * 1000; // 30 Minutes

export const useGithubIssues = () => {
  const [issues, setIssues] = useState<GithubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Repo Configuration
  const [repoConfig, setRepoConfig] = useState<RepoConfig>({ owner: 'facebook', repo: 'react', token: '' });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true); // Simple assumption logic

  // Local State Persistence (The "Sync" requirement)
  const [processedMap, setProcessedMap] = useState<ProcessedMap>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load processed state", e);
      return {};
    }
  });

  // Save to local storage whenever processedMap changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processedMap));
  }, [processedMap]);

  // Fetch Logic
  const loadIssues = useCallback(async (isPolling = false) => {
    if (!repoConfig.owner || !repoConfig.repo) return;
    
    if (!isPolling) setLoading(true);
    setError(null);

    try {
      const data = await fetchIssuesFromGithub(repoConfig, page);
      setIssues(data);
      // If we get fewer than requested, likely end of list
      setHasNextPage(data.length > 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [repoConfig, page]);

  // Initial load & Page change
  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // Polling Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(`[Auto-Refresh] Polling GitHub API for ${repoConfig.owner}/${repoConfig.repo}...`);
      loadIssues(true);
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadIssues]);

  // Actions
  const toggleProcessed = (issueId: number) => {
    setProcessedMap(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  const updateConfig = (owner: string, repo: string, token?: string) => {
    setRepoConfig({ owner, repo, token });
    setPage(1); // Reset to page 1 on repo change
  };

  const nextPage = () => setPage(p => p + 1);
  const prevPage = () => setPage(p => Math.max(1, p - 1));

  return {
    issues,
    loading,
    error,
    page,
    processedMap,
    repoConfig,
    updateConfig,
    toggleProcessed,
    nextPage,
    prevPage,
    refresh: () => loadIssues(false)
  };
};
