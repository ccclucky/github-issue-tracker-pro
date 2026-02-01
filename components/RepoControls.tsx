import React, { useState } from 'react';
import { RepoConfig } from '../types';
import { RefreshIcon } from './Icons';

interface RepoControlsProps {
  config: RepoConfig;
  onUpdate: (owner: string, repo: string, token?: string) => void;
  onRefresh: () => void;
  loading: boolean;
  page: number;
}

export const RepoControls: React.FC<RepoControlsProps> = ({ config, onUpdate, onRefresh, loading, page }) => {
  const [owner, setOwner] = useState(config.owner);
  const [repo, setRepo] = useState(config.repo);
  const [token, setToken] = useState(config.token || '');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(owner, repo, token);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Title & Page Info */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-md text-sm font-mono">
              {config.owner}/{config.repo}
            </span>
            <span className="text-gray-400 text-sm font-normal">Page {page}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">自动轮询已开启 (每30分钟)</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
           <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-gray-600 hover:text-blue-600 underline px-2"
          >
            {showSettings ? '隐藏设置' : '仓库设置'}
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '同步中...' : '立即刷新'}
          </button>
        </div>
      </div>

      {/* Expandable Settings Form */}
      {showSettings && (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Owner</label>
            <input
              type="text"
              value={owner}
              onChange={e => setOwner(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="facebook"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Repo</label>
            <input
              type="text"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="react"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Token (可选, 防限流)</label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="ghp_..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            应用更改
          </button>
        </form>
      )}
    </div>
  );
};
