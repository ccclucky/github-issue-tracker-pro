import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useGithubIssues } from './hooks/useGithubIssues';
import { RepoControls } from './components/RepoControls';
import { IssueList } from './components/IssueList';
import { LoginScreen } from './components/LoginScreen';

const AUTH_STORAGE_KEY = 'issue_tracker_auth_token';

const App: React.FC = () => {
  // Authentication Logic
  const envPassword = process.env.ACCESS_PASSWORD;
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // If no password set in env, always authenticated
    if (!envPassword) return true;
    // Check local storage for previous session
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  const handleLogin = (inputPassword: string): boolean => {
    if (inputPassword === envPassword) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Main Application Logic
  const {
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
    refresh
  } = useGithubIssues();

  // If password is required and not authenticated, show Login Screen
  if (envPassword && !isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
               GH
             </div>
             <h1 className="text-xl font-bold tracking-tight text-gray-900">Issue Tracker Pro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              <span>已处理: {Object.values(processedMap).filter(Boolean).length} 个</span>
            </div>
            
            {envPassword && (
              <button 
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-800 font-medium border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
              >
                退出登录
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">加载失败: {error}</p>
                {error.includes('403') && (
                    <p className="text-xs text-red-600 mt-1">提示：GitHub 对未授权请求有限制，请在设置中填入 Personal Access Token。</p>
                )}
              </div>
            </div>
          </div>
        )}

        <RepoControls 
          config={repoConfig}
          onUpdate={updateConfig}
          onRefresh={refresh}
          loading={loading}
          page={page}
        />

        <IssueList 
          issues={issues}
          processedMap={processedMap}
          onToggle={toggleProcessed}
          loading={loading}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={prevPage}
            disabled={page === 1 || loading}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
              (page === 1 || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            上一页
          </button>
          
          <span className="text-sm text-gray-600">
             当前第 <span className="font-bold text-gray-900">{page}</span> 页
          </span>

          <button
            onClick={nextPage}
            disabled={loading} // Simple logic: disable if loading, real app would check hasNextPage more strictly
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            下一页
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
