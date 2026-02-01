import { useState, useEffect, useCallback, useRef } from 'react';
import { GithubIssue, RepoConfig, ProcessedMap, NotesMap, UserNote } from '../types';
import { fetchIssuesFromGithub } from '../services/github';

const STORAGE_KEY_PROCESSED = 'github_issue_tracker_processed_v1';
const STORAGE_KEY_NOTES = 'github_issue_tracker_notes_v1';
const POLLING_INTERVAL = 30 * 60 * 1000; // 30 Minutes

export const useGithubIssues = () => {
  const [issues, setIssues] = useState<GithubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Repo Configuration - Default new4u/HackRun-Club
  const [repoConfig, setRepoConfig] = useState<RepoConfig>({ owner: 'new4u', repo: 'HackRun-Club', token: '' });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Local State Persistence: Processed Status
  const [processedMap, setProcessedMap] = useState<ProcessedMap>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROCESSED);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load processed state", e);
      return {};
    }
  });

  // Local State Persistence: Notes (Remarks)
  const [notesMap, setNotesMap] = useState<NotesMap>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTES);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load notes state", e);
      return {};
    }
  });

  // Save to local storage whenever processedMap changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROCESSED, JSON.stringify(processedMap));
  }, [processedMap]);

  // Save to local storage whenever notesMap changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesMap));
  }, [notesMap]);

  // Fetch Logic
  const loadIssues = useCallback(async (isPolling = false) => {
    if (!repoConfig.owner || !repoConfig.repo) return;
    
    if (!isPolling) setLoading(true);
    setError(null);

    try {
      const data = await fetchIssuesFromGithub(repoConfig, page);
      setIssues(data);
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

  const updateNote = (issueId: number, note: UserNote) => {
    setNotesMap(prev => ({
      ...prev,
      [issueId]: note
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
    notesMap,
    repoConfig,
    updateConfig,
    toggleProcessed,
    updateNote,
    nextPage,
    prevPage,
    refresh: () => loadIssues(false)
  };
};
