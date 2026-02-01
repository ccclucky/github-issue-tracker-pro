import { GithubIssue, NotesMap, ProcessedMap, RepoConfig } from '../types';

export const generateHtmlReport = (
  issues: GithubIssue[],
  processedMap: ProcessedMap,
  notesMap: NotesMap,
  config: RepoConfig
): string => {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  const tableRows = issues.map(issue => {
    const isProcessed = processedMap[issue.id];
    const note = notesMap[issue.id];
    
    // Format Note Content
    let noteContent = '<span class="empty">暂无信息</span>';
    
    if (note && typeof note !== 'string') {
      const parts = [];
      if (note.name) parts.push(`<div class="field"><strong>称呼:</strong> ${note.name}</div>`);
      if (note.role) parts.push(`<div class="field"><strong>角色:</strong> ${note.role}</div>`);
      if (note.motivation) parts.push(`<div class="field"><strong>动机:</strong> ${note.motivation}</div>`);
      
      if (note.hasIdea) {
        parts.push(`
          <div class="field idea-box">
             <strong>💡 Idea:</strong>
             <div class="idea-text">${note.ideaDetails || '（未填写详情）'}</div>
          </div>
        `);
      }
      
      if (note.other) parts.push(`<div class="field"><strong>其他:</strong> ${note.other}</div>`);
      
      if (parts.length > 0) {
        noteContent = parts.join('');
      }
    }

    const stateClass = issue.state === 'open' ? 'status-open' : 'status-closed';
    const processedClass = isProcessed ? 'row-processed' : '';
    const processedBadge = isProcessed ? '<span class="badge badge-processed">已处理</span>' : '<span class="badge badge-pending">未处理</span>';

    return `
      <tr class="${processedClass}">
        <td style="text-align:center">${processedBadge}</td>
        <td>
          <div class="issue-id">#${issue.number}</div>
          <div class="${stateClass}">${issue.state.toUpperCase()}</div>
        </td>
        <td>
          <a href="${issue.html_url}" target="_blank" class="issue-title">${issue.title}</a>
          <div class="labels">
            ${issue.labels.map(l => 
              `<span class="label" style="background-color: #${l.color}20; color: #000; border: 1px solid #${l.color}">${l.name}</span>`
            ).join('')}
          </div>
        </td>
        <td>
          <div class="user-info">
            <img src="${issue.user.avatar_url}" alt="${issue.user.login}" />
            <span>${issue.user.login}</span>
          </div>
        </td>
        <td class="note-cell">${noteContent}</td>
        <td>${new Date(issue.updated_at).toLocaleString('zh-CN')}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Issue Report - ${config.owner}/${config.repo}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f9fafb; padding: 20px; color: #374151; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    h1 { font-size: 24px; margin-bottom: 10px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; }
    .meta { font-size: 14px; color: #6b7280; margin-bottom: 20px; display: flex; justify-content: space-between; }
    
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { text-align: left; padding: 12px; background: #f3f4f6; color: #4b5563; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e5e7eb; }
    td { padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-size: 14px; }
    tr:last-child td { border-bottom: none; }
    tr:hover { background-color: #f9fafb; }
    .row-processed { background-color: #f0fdf4; }

    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
    .badge-processed { background: #dcfce7; color: #15803d; }
    .badge-pending { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }

    .issue-id { font-family: monospace; color: #6b7280; font-size: 12px; }
    .issue-title { font-weight: 600; color: #111827; text-decoration: none; display: block; margin-bottom: 4px; }
    .issue-title:hover { color: #2563eb; }
    
    .status-open { color: #16a34a; font-size: 12px; font-weight: bold; }
    .status-closed { color: #9333ea; font-size: 12px; font-weight: bold; }

    .labels { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .label { font-size: 10px; padding: 1px 6px; border-radius: 999px; }

    .user-info { display: flex; items-center; gap: 6px; }
    .user-info img { width: 20px; height: 20px; border-radius: 50%; }

    /* Note Styling */
    .note-cell { min-width: 250px; }
    .field { margin-bottom: 4px; line-height: 1.4; }
    .empty { color: #9ca3af; font-style: italic; font-size: 12px; }
    .idea-box { background: #eff6ff; border: 1px solid #dbeafe; padding: 8px; border-radius: 6px; margin-top: 6px; }
    .idea-text { margin-top: 2px; color: #1e40af; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Github Issue Report</h1>
    <div class="meta">
      <span><strong>仓库:</strong> ${config.owner}/${config.repo}</span>
      <span><strong>导出时间:</strong> ${timestamp}</span>
    </div>

    <table>
      <thead>
        <tr>
          <th width="80">处理状态</th>
          <th width="80">状态</th>
          <th>Issue 详情</th>
          <th width="150">提交人</th>
          <th width="350">备注信息 (User Note)</th>
          <th width="150">更新时间</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>
</body>
</html>
  `;
};
