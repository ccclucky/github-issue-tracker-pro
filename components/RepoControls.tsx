import React, { useState } from 'react';
import { RepoConfig } from '../types';
import { RefreshIcon, DownloadIcon } from './Icons';

interface RepoControlsProps {
  config: RepoConfig;
  onUpdate: (owner: string, repo: string, token?: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  isExporting?: boolean;
  page: number;
}

export const RepoControls: React.FC<RepoControlsProps> = ({ config, onUpdate, onRefresh, onExport, loading, isExporting = false, page }) => {
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
            <span className="bg-blue-50 text-blue-700 border border-blue-100 py-1 px-3 rounded-md text-sm font-mono">
              {config.owner}/{config.repo}
            </span>
            <span className="text-gray-400 text-sm font-normal">Page {page}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 ml-1">自动轮询已开启 (每30分钟)</p>
        </div>

        {/* Controls Group */}
        <div className="flex items-center gap-3 w-full md:w-auto">
           {/* Settings Toggle */}
           <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-1 font-medium"
          >
            {showSettings ? '收起设置' : '仓库设置'}
          </button>
          
          {/* Vertical Divider */}
          <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          
          {/* Action Buttons - Unified Style */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              disabled={isExporting}
              className={`flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all shadow-sm active:scale-[0.98] ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
              title="导出所有数据为HTML报告"
            >
              <DownloadIcon className={`w-4 h-4 text-gray-500 ${isExporting ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline text-sm font-medium">{isExporting ? '导出中...' : '导出 HTML'}</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={loading || isExporting}
              className={`flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all shadow-sm active:scale-[0.98] ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              <RefreshIcon className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-sm font-medium">{loading ? '同步中...' : '立即刷新'}</span>
              <span className="sm:hidden text-sm font-medium">刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Settings Form */}
      {showSettings && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSubmit} className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Owner</label>
              <input
                type="text"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                placeholder="facebook"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Repo</label>
              <input
                type="text"
                value={repo}
                onChange={e => setRepo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                placeholder="react"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Token (可选, 防限流)</label>
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                placeholder="ghp_..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm"
            >
              应用更改
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
