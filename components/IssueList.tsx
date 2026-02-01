import React from 'react';
import { GithubIssue } from '../types';
import { CheckCircleIcon, ExternalLinkIcon, GithubIcon } from './Icons';

interface IssueListProps {
  issues: GithubIssue[];
  processedMap: Record<number, boolean>;
  onToggle: (id: number) => void;
  loading: boolean;
}

export const IssueList: React.FC<IssueListProps> = ({ issues, processedMap, onToggle, loading }) => {
  if (loading && issues.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">正在加载数据...</p>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">当前没有 Issue 或列表为空。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 w-20 text-center">状态</th>
              <th className="px-6 py-4">Issue 详情</th>
              <th className="px-6 py-4 w-40">更新时间</th>
              <th className="px-6 py-4 w-32 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issues.map((issue) => {
              const isProcessed = !!processedMap[issue.id];
              return (
                <tr 
                  key={issue.id} 
                  className={`group transition-colors hover:bg-gray-50 ${isProcessed ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      issue.state === 'open' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <GithubIcon className="w-5 h-5" />
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <a 
                        href={issue.html_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`text-sm font-medium hover:text-blue-600 flex items-center gap-1 mb-1 ${
                          isProcessed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        <span className="text-gray-500">#{issue.number}</span>
                        {issue.title}
                        <ExternalLinkIcon className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                      </a>
                      
                      <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                        <img 
                          src={issue.user.avatar_url} 
                          alt={issue.user.login} 
                          className="w-4 h-4 rounded-full"
                        />
                        <span>{issue.user.login}</span>
                        
                        {issue.labels.length > 0 && (
                           <div className="flex gap-1 ml-2">
                             {issue.labels.slice(0, 3).map(label => (
                               <span 
                                key={label.id}
                                className="px-1.5 py-0.5 rounded-full text-[10px] border"
                                style={{ 
                                  borderColor: `#${label.color}`, 
                                  backgroundColor: `#${label.color}20`,
                                  color: `#000` // Github label colors are tricky for contrast, keeping simple black for now or calculate later
                                }}
                               >
                                 {label.name}
                               </span>
                             ))}
                           </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(issue.updated_at).toLocaleString('zh-CN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onToggle(issue.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isProcessed
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-white border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 shadow-sm'
                      }`}
                    >
                      {isProcessed ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4" /> 已处理
                        </>
                      ) : (
                        <>未处理</>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
