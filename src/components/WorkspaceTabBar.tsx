import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { WorkspaceTab, ThemeMode } from '../types';

interface WorkspaceTabBarProps {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
  onRenameTab: (tabId: string, newTitle: string) => void;
  theme: ThemeMode;
}

export const WorkspaceTabBar: React.FC<WorkspaceTabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onRenameTab,
  theme
}) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  const handleStartRename = (e: React.MouseEvent, tab: WorkspaceTab) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditingTitle(tab.title);
  };

  const handleSaveRename = (tabId: string) => {
    const trimmed = editingTitle.trim();
    if (trimmed) {
      onRenameTab(tabId, trimmed);
    }
    setEditingTabId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(tabId);
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="w-full shrink-0 select-none overflow-x-auto relative transition-colors"
      style={{
        height: '32px',
        padding: '4px 12px 0 12px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        zIndex: 30,
        background: isDark ? 'rgba(6, 9, 15, 0.92)' : '#E2E8F0',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isEditing = editingTabId === tab.id;

        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onDoubleClick={(e) => handleStartRename(e, tab)}
            title={`Workspace: ${tab.title} (Double-click to rename)`}
            className="group relative transition-all duration-150"
            style={{
              height: '27px',
              padding: '0 8px 0 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '180px',
              minWidth: '100px',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: '5px 5px 0 0',
              borderTop: isActive
                ? isDark
                  ? '1.5px solid #38BDF8'
                  : '1.5px solid #0284c7'
                : isDark
                ? '1px solid rgba(255, 255, 255, 0.07)'
                : '1px solid rgba(148, 163, 184, 0.35)',
              borderLeft: isActive
                ? isDark
                  ? '1px solid rgba(56, 189, 248, 0.35)'
                  : '1px solid rgba(2, 132, 199, 0.35)'
                : isDark
                ? '1px solid rgba(255, 255, 255, 0.07)'
                : '1px solid rgba(148, 163, 184, 0.35)',
              borderRight: isActive
                ? isDark
                  ? '1px solid rgba(56, 189, 248, 0.35)'
                  : '1px solid rgba(2, 132, 199, 0.35)'
                : isDark
                ? '1px solid rgba(255, 255, 255, 0.07)'
                : '1px solid rgba(148, 163, 184, 0.35)',
              borderBottom: isActive
                ? isDark
                  ? '1px solid #0B0F17'
                  : '1px solid #f8fafc'
                : 'none',
              background: isActive
                ? isDark
                  ? 'linear-gradient(180deg, rgba(14, 165, 233, 0.14) 0%, rgba(11, 15, 23, 0.98) 100%)'
                  : 'linear-gradient(180deg, rgba(2, 132, 199, 0.12) 0%, rgba(248, 250, 252, 0.98) 100%)'
                : isDark
                ? 'rgba(15, 23, 42, 0.45)'
                : 'rgba(226, 232, 240, 0.5)',
              boxShadow: isActive
                ? isDark
                  ? '0 -2px 10px rgba(56, 189, 248, 0.15)'
                  : '0 -2px 8px rgba(2, 132, 199, 0.1)'
                : 'none'
            }}
          >
            {/* Left Cluster: Status dot + Title */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {isActive && (
                <span
                  className="shrink-0"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? '#38BDF8' : '#0284c7',
                    boxShadow: isDark ? '0 0 6px #38BDF8' : '0 0 5px #0284c7'
                  }}
                />
              )}

              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleSaveRename(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[11px] font-semibold bg-transparent outline-none w-full border-b border-sky-400 px-0.5 text-white"
                  style={{
                    color: isDark ? '#38BDF8' : '#0284c7',
                    lineHeight: '14px'
                  }}
                />
              ) : (
                <span
                  className="font-mono text-[11px] truncate tracking-wide"
                  style={{
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? isDark
                        ? '#38BDF8'
                        : '#0284c7'
                      : isDark
                      ? '#64748B'
                      : '#64748b'
                  }}
                >
                  {tab.title}
                </span>
              )}
            </div>

            {/* Right: Close Button (Hidden if only 1 tab) */}
            {tabs.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                title={`Close ${tab.title}`}
                className="shrink-0 flex items-center justify-center transition-colors rounded-[3px]"
                style={{
                  width: '14px',
                  height: '14px',
                  color: isDark ? '#64748B' : '#94A3B8'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.2)';
                  e.currentTarget.style.color = '#F43F5E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#64748B' : '#94A3B8';
                }}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            )}
          </div>
        );
      })}

      {/* '+' New Tab Button */}
      <button
        type="button"
        onClick={onNewTab}
        title="Open New Tactical Workspace Tab"
        className="shrink-0 transition-all cursor-pointer"
        style={{
          width: '24px',
          height: '24px',
          marginBottom: '2px',
          marginLeft: '2px',
          borderRadius: '4px',
          border: isDark ? '1px dashed rgba(255, 255, 255, 0.18)' : '1px dashed rgba(100, 116, 139, 0.4)',
          background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          color: isDark ? '#94A3B8' : '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = isDark ? '#38BDF8' : '#0284c7';
          e.currentTarget.style.color = isDark ? '#38BDF8' : '#0284c7';
          e.currentTarget.style.background = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(100, 116, 139, 0.4)';
          e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B';
          e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)';
        }}
      >
        <Plus size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
};
