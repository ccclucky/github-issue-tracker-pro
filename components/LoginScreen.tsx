import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-slate-850 p-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-md">
            GH
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">Issue Tracker Pro</h1>
          <p className="text-gray-400 text-sm mt-1">受保护的访问区域</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                请输入访问密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                } focus:ring-2 focus:border-blue-500 outline-none transition-all`}
                placeholder="Password"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  密码错误，请重试
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-850 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
            >
              解锁进入
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            此应用受环境变量控制，请联系管理员获取权限。
          </p>
        </div>
      </div>
    </div>
  );
};
