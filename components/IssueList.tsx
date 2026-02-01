import React, { useState } from 'react';
import { GithubIssue, UserNote, NotesMap } from '../types';
import { CheckCircleIcon, ExternalLinkIcon, GithubIcon, PencilIcon, DocumentTextIcon } from './Icons';
import { NoteModal } from './NoteModal';

interface IssueListProps {
  issues: GithubIssue[];
  processedMap: Record<number, boolean>;
  notesMap: NotesMap;
  onToggle: (id: number) => void;
  onUpdateNote: (id: number, note: UserNote) => void;
  loading: boolean;
}

export const IssueList: React.FC<IssueListProps> = ({ 
  issues, 
  processedMap, 
  notesMap,
  onToggle, 
  onUpdateNote,
  loading 
}) => {
  const [editingIssueId, setEditingIssueId] = useState<number | null>(null);

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

  const handleEditClick = (issueId: number) => {
    setEditingIssueId(issueId);
  };

  const handleModalClose = () => {
    setEditingIssueId(null);
  };

  const handleSaveNote = (note: UserNote) => {
    if (editingIssueId) {
      onUpdateNote(editingIssueId, note);
    }
  };

  const currentEditingIssue = issues.find(i => i.id === editingIssueId);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-20 text-center">状态</th>
                <th className="px-6 py-4 w-1/4">Issue 详情</th>
                <th className="px-6 py-4 w-1/4">备注信息</th>
                <th className="px-6 py-4 w-24">更新时间</th>
                <th className="px-6 py-4 w-32 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issues.map((issue) => {
                const isProcessed = !!processedMap[issue.id];
                const note = notesMap[issue.id];
                const hasNote = note && typeof note !== 'string' && (note.name || note.role || note.other);
                
                return (
                  <tr 
                    key={issue.id} 
                    className={`group transition-colors hover:bg-gray-50 ${isProcessed ? 'bg-gray-50/50' : ''}`}
                  >
                    {/* 1. Status Icon */}
                    <td className="px-6 py-4 text-center align-top">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        issue.state === 'open' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        <GithubIcon className="w-5 h-5" />
                      </div>
                    </td>
                    
                    {/* 2. Issue Details */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col">
                        <a 
                          href={issue.html_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`text-sm font-medium hover:text-blue-600 flex items-center gap-1 mb-1 ${
                            isProcessed ? 'text-gray-500' : 'text-gray-900'
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
                             <div className="flex gap-1 ml-2 flex-wrap">
                               {issue.labels.slice(0, 3).map(label => (
                                 <span 
                                  key={label.id}
                                  className="px-1.5 py-0.5 rounded-full text-[10px] border truncate max-w-[100px]"
                                  style={{ 
                                    borderColor: `#${label.color}`, 
                                    backgroundColor: `#${label.color}20`,
                                    color: `#000`
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

                    {/* 3. Structured Note Summary */}
                    <td className="px-6 py-4 align-top">
                      {hasNote ? (
                        <div className="text-sm space-y-1">
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                             {note.name}
                             {note.role && <span className="text-xs font-normal px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{note.role}</span>}
                          </div>
                          {note.hasIdea && (
                             <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
                               💡 有 Idea
                             </div>
                          )}
                          {(note.motivation || note.other) && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {note.motivation || note.other}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">暂无信息</span>
                      )}
                    </td>

                    {/* 4. Date */}
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap align-top">
                      {new Date(issue.updated_at).toLocaleString('zh-CN', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>

                    {/* 5. Actions */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col items-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditClick(issue.id)}
                          className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                          {hasNote ? '编辑信息' : '添加信息'}
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => onToggle(issue.id)}
                          className={`w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            isProcessed
                              ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                              : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {isProcessed ? (
                            <>
                              <CheckCircleIcon className="w-3.5 h-3.5" /> 已处理
                            </>
                          ) : (
                            <>标记处理</>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <NoteModal 
        isOpen={!!editingIssueId}
        onClose={handleModalClose}
        onSave={handleSaveNote}
        initialNote={editingIssueId ? notesMap[editingIssueId] : undefined}
        issueTitle={currentEditingIssue?.title || ''}
      />
    </>
  );
};
