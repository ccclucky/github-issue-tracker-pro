import React, { useState, useEffect } from 'react';
import { UserNote } from '../types';
import { XCircleIcon } from './Icons';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: UserNote) => void;
  initialNote?: UserNote;
  issueTitle: string;
}

const defaultNote: UserNote = {
  name: '',
  role: '',
  motivation: '',
  hasIdea: false,
  ideaDetails: '',
  other: ''
};

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, initialNote, issueTitle }) => {
  const [formData, setFormData] = useState<UserNote>(defaultNote);

  // Reset or load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialNote) {
        // Migration safety: if initialNote is a string (legacy data), treat it as 'other' or reset
        if (typeof initialNote === 'string') {
           setFormData({ ...defaultNote, other: initialNote });
        } else {
           setFormData({ ...defaultNote, ...initialNote });
        }
      } else {
        setFormData(defaultNote);
      }
    }
  }, [isOpen, initialNote]);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserNote, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">编辑备注信息</h3>
            <p className="text-xs text-gray-500 truncate max-w-[300px]">{issueTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="note-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">称呼 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
                placeholder="例如：Alex"
              />
            </div>

            {/* 2. Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">团队角色</label>
              <input 
                type="text" 
                value={formData.role}
                onChange={e => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
                placeholder="例如：前端开发、PM、UI设计师"
              />
            </div>

            {/* 3. Motivation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">参与动机</label>
              <input 
                type="text" 
                value={formData.motivation}
                onChange={e => handleChange('motivation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
                placeholder="例如：学习新技术、扩展人脉"
              />
            </div>

            {/* 4. Idea Check */}
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="hasIdea"
                  checked={formData.hasIdea}
                  onChange={e => handleChange('hasIdea', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="hasIdea" className="text-sm font-semibold text-gray-800 select-none cursor-pointer">
                  我有 Idea 💡
                </label>
              </div>

              {formData.hasIdea && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <textarea 
                    value={formData.ideaDetails}
                    onChange={e => handleChange('ideaDetails', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px]"
                    placeholder="请简单描述你的想法..."
                  />
                </div>
              )}
            </div>

            {/* 5. Other */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">其他备注</label>
              <textarea 
                value={formData.other}
                onChange={e => handleChange('other', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[100px]"
                placeholder="任何其他需要补充的信息..."
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button 
            type="submit" 
            form="note-form"
            className="px-4 py-2 text-sm font-bold text-white bg-slate-850 hover:bg-slate-700 rounded-lg shadow-sm"
          >
            保存信息
          </button>
        </div>
      </div>
    </div>
  );
};
