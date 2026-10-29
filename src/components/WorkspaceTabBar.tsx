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
        background: isDark ? 'rgba(6, 9, 15, 0.92)' : 'var(--bg-panel)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-subtle)',
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
            className={`group relative transition-all duration-150 ${
              !isDark && !isActive ? 'hover:bg-[var(--bg-sunken)]' : ''
            }`}
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
              borderRadius: isDark ? '5px 5px 0 0' : '6px 6px 0 0',
              borderTop: isActive
                ? isDark
                  ? '1.5px solid #38BDF8'
                  : '1px solid var(--border-subtle)'
                : isDark
                ? '1px solid rgba(255, 255, 255, 0.07)'
                : '1px solid transparent',
              borderLeft: isActive
                ? isDark
                  ? '1px solid rgba(56, 189, 248, 0.35)'
                  : '1px solid var(--border-subtle)'
                : isDark
                ? '1px solid rgba(255, 255, 255, 0.07)'
                : '1px solid transparent',
              borderRight: isActive
                ? isDark
                  ? '1px solid rgba(56, 189, 248, 0.35)'
                  : '1px solid var(--border-subtle)'
                : isDark
                ? '1px solid rgba(255, 255, 255, 0.07)'
                : '1px solid transparent',
              borderBottom: isActive
                ? isDark
                  ? '1px solid #0B0F17'
                  : '2px solid var(--accent)'
                : 'none',
              background: isActive
                ? isDark
                  ? 'linear-gradient(180deg, rgba(14, 165, 233, 0.14) 0%, rgba(11, 15, 23, 0.98) 100%)'
                  : 'var(--surface)'
                : isDark
                ? 'rgba(15, 23, 42, 0.45)'
                : 'transparent',
              boxShadow: isActive
                ? isDark
                  ? '0 -2px 10px rgba(56, 189, 248, 0.15)'
                  : 'var(--shadow-sm)'
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
                    backgroundColor: isDark ? '#38BDF8' : 'var(--accent)',
                    boxShadow: isDark ? '0 0 6px #38BDF8' : 'none'
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
                  className={`text-[11px] font-semibold bg-transparent outline-none w-full border-b px-0.5 ${
                    isDark ? 'font-mono border-sky-400 text-white' : 'font-sans border-[var(--accent)] text-[var(--text-primary)]'
                  }`}
                  style={{
                    color: isDark ? '#38BDF8' : 'var(--accent-text)',
                    lineHeight: '14px'
                  }}
                />
              ) : (
                <span
                  className={`text-[11px] truncate tracking-wide ${isDark ? 'font-mono' : 'font-sans'}`}
                  style={{
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? isDark
                        ? '#38BDF8'
                        : 'var(--text-primary)'
                      : isDark
                      ? '#64748B'
                      : 'var(--text-secondary)'
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
                  color: isDark ? '#64748B' : 'var(--text-tertiary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(244, 63, 94, 0.2)' : 'var(--sev-critical-bg)';
                  e.currentTarget.style.color = isDark ? '#F43F5E' : 'var(--sev-critical)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#64748B' : 'var(--text-tertiary)';
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
          border: isDark ? '1px dashed rgba(255, 255, 255, 0.18)' : '1px dashed var(--border-strong)',
          background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
          color: isDark ? '#94A3B8' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = isDark ? '#38BDF8' : 'var(--accent)';
          e.currentTarget.style.color = isDark ? '#38BDF8' : 'var(--accent-text)';
          e.currentTarget.style.background = isDark ? 'rgba(56, 189, 248, 0.08)' : 'var(--accent-soft)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.18)' : 'var(--border-strong)';
          e.currentTarget.style.color = isDark ? '#94A3B8' : 'var(--text-secondary)';
          e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent';
        }}
      >
        <Plus size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
};
