import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  ExternalLink,
  Plus,
  Tv,
  FileText,
  Flame,
  Swords,
  Shield,
  Crosshair,
  Trash2,
  Radio
} from 'lucide-react';
import { WorkspaceDrawerTab, WorkspaceDrawerItem, ThemeMode } from '../types';

interface IntelWorkspaceDrawerProps {
  isOpen: boolean;
  isMinimized: boolean;
  width: number; // 440 or 640
  tabs: WorkspaceDrawerTab[];
  activeTabId: string;
  theme: ThemeMode;
  onClose: () => void;
  onToggleMinimize: () => void;
  onToggleWidth: () => void;
  onSelectTab: (tabId: string) => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
  onRenameTab: (tabId: string, newTitle: string) => void;
  onRemoveItem: (tabId: string, itemId: string) => void;
  onDropItem: (tabId: string, item: WorkspaceDrawerItem) => void;
  onCenterMap: (coords: [number, number]) => void;
}

export const IntelWorkspaceDrawer: React.FC<IntelWorkspaceDrawerProps> = ({
  isOpen,
  isMinimized,
  width,
  tabs,
  activeTabId,
  theme,
  onClose,
  onToggleMinimize,
  onToggleWidth,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onRenameTab,
  onRemoveItem,
  onDropItem,
  onCenterMap
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const items = activeTab ? activeTab.items : [];
  const videoCount = items.filter((i) => i.type === 'video').length;

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (parsed && parsed.item) {
          onDropItem(activeTabId, parsed.item);
        }
      }
    } catch (err) {
      console.warn('Failed to parse dropped intel item:', err);
    }
  };

  const handleStartRename = (e: React.MouseEvent, tab: WorkspaceDrawerTab) => {
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

  // Render Minimized Edge Rail
  if (isMinimized) {
    return (
      <div
        onClick={onToggleMinimize}
        className="absolute top-[76px] bottom-0 right-0 z-35 flex flex-col items-center justify-between py-4 cursor-pointer transition-all duration-200 shadow-2xl select-none"
        style={{
          width: '36px',
          background: isDark ? '#080C14' : '#F1F5F9',
          borderLeft: '1px solid rgba(56, 189, 248, 0.4)'
        }}
        title="Expand Intel Workspace Drawer"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 flex items-center justify-center">
            <Radio size={11} className="animate-pulse" />
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        </div>

        <div
          className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase py-2 whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          INTEL WORKSPACE ({items.length})
        </div>

        <button
          type="button"
          className="p-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
          title="Expand Drawer"
        >
          <ChevronLeft size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="absolute top-[76px] bottom-0 right-0 z-35 flex flex-col transition-all duration-300 shadow-2xl select-none"
      style={{
        width: `${width}px`,
        maxWidth: '100vw',
        background: isDark ? 'var(--bg-surface)' : '#FFFFFF',
        borderLeft: '1px solid var(--border-medium)',
        boxShadow: '-16px 0 32px rgba(0, 0, 0, 0.65)'
      }}
    >
      {/* 1. Header Toolbar */}
      <div
        className="h-10 px-3 flex items-center justify-between shrink-0 border-b select-none font-mono text-xs"
        style={{
          background: isDark ? 'rgba(8, 12, 20, 0.95)' : '#F8FAFC',
          borderColor: 'var(--border-subtle)'
        }}
      >
        {/* Left: Emblem + Title + Count */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[3px] bg-sky-500/15 border border-sky-500/40 text-sky-400 flex items-center justify-center">
            <Radio size={12} className="animate-pulse" />
          </div>
          <span className="font-bold tracking-wider text-slate-100 uppercase text-[11px]">
            INTEL WORKSPACE
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {/* Right: Expand/Collapse Width + Minimize + Close */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Width (440px <-> 640px) */}
          <button
            type="button"
            onClick={onToggleWidth}
            className="p-1 rounded text-[var(--text-muted)] hover:text-sky-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title={width === 440 ? 'Expand to 640px Multi-Grid' : 'Shrink to 440px Standard'}
          >
            {width === 440 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
          </button>

          {/* Minimize to Slim Vertical Rail */}
          <button
            type="button"
            onClick={onToggleMinimize}
            className="p-1 rounded text-[var(--text-muted)] hover:text-amber-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Minimize to Edge Rail (>>)"
          >
            <ChevronRight size={14} />
          </button>

          {/* Close Drawer */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Close Workspace Drawer (×)"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 2. Drawer Multi-Tab Bar */}
      <div
        className="h-8 px-2 flex items-end gap-1 shrink-0 overflow-x-auto select-none font-mono text-[11px]"
        style={{
          background: isDark ? 'rgba(6, 9, 15, 0.96)' : '#E2E8F0',
          borderBottom: '1px solid var(--border-subtle)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isEditing = editingTabId === tab.id;
          const vCount = tab.items.filter((i) => i.type === 'video').length;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              onDoubleClick={(e) => handleStartRename(e, tab)}
              className="group relative transition-all duration-150"
              style={{
                height: '26px',
                padding: '0 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                maxWidth: '160px',
                minWidth: '90px',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0',
                borderTop: isActive ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                borderLeft: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRight: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: isActive ? (isDark ? '1px solid #0B0F17' : '1px solid #FFFFFF') : 'none',
                background: isActive
                  ? 'linear-gradient(180deg, rgba(14, 165, 233, 0.16) 0%, rgba(11, 15, 23, 0.98) 100%)'
                  : 'rgba(15, 23, 42, 0.45)',
                color: isActive ? '#38BDF8' : 'var(--text-muted)'
              }}
              title={`${tab.title} (${tab.items.length} items) - Double click to rename`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {vCount > 0 ? <Tv size={11} className="shrink-0 text-sky-400" /> : <FileText size={11} className="shrink-0 text-slate-400" />}

                {isEditing ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveRename(tab.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(tab.id);
                      if (e.key === 'Escape') setEditingTabId(null);
                    }}
                    autoFocus
                    className="font-mono text-[10.5px] bg-transparent outline-none w-full border-b border-sky-400 px-0.5 text-white"
                  />
                ) : (
                  <span className="truncate text-[10.5px] font-semibold">
                    {tab.title} {tab.items.length > 0 && `(${tab.items.length})`}
                  </span>
                )}
              </div>

              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="shrink-0 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Close Tab"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          type="button"
          onClick={onNewTab}
          className="shrink-0 mb-1 ml-1 w-5 h-5 rounded-[3px] border border-dashed border-white/20 hover:border-sky-400 text-slate-400 hover:text-sky-400 flex items-center justify-center transition-colors cursor-pointer"
          title="Open New Workspace Tab"
        >
          <Plus size={11} />
        </button>
      </div>

      {/* 3. Drop Zone Visual Cue (When Dragging Over) */}
      {isDragOver && (
        <div
          className="p-3 m-3 rounded-[4px] border-2 border-dashed border-sky-400 bg-sky-500/10 text-sky-400 font-mono text-center text-xs animate-pulse"
        >
          + DROP INTEL TO ADD TO &quot;{activeTab ? activeTab.title : 'WORKSPACE'}&quot;
        </div>
      )}

      {/* 4. Scrollable Multi-Item Workspace Canvas */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 feed-scrollbar">
        {items.length === 0 ? (
          <div
            className="h-64 border-2 border-dashed rounded-[4px] flex flex-col items-center justify-center text-center p-6 font-mono text-xs select-none transition-colors"
            style={{
              borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#CBD5E1',
              background: isDark ? 'rgba(14, 165, 233, 0.03)' : '#F8FAFC'
            }}
          >
            <Radio size={24} className="text-sky-400 mb-2 opacity-70 animate-pulse" />
            <h4 className="font-bold text-slate-200 mb-1">CANVAS EMPTY</h4>
            <p className="text-[11px] text-[var(--text-muted)] max-w-xs mb-3">
              Drag any card or video dispatch from the Intelligence Desk, or click on intel reports to mount them here.
            </p>
            <div className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-[10px] text-sky-400 font-bold">
              CANVA-STYLE DRAG & DROP ENABLED
            </div>
          </div>
        ) : (
          <div className={width === 640 && videoCount > 1 ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
            {items.map((item) => {
              const isVideo = item.type === 'video';

              return (
                <div
                  key={item.id}
                  className="rounded-[4px] border overflow-hidden shadow-lg transition-all"
                  style={{
                    background: isDark ? 'var(--bg-surface-elevated)' : '#FFFFFF',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  {/* Item Header */}
                  <div
                    className="px-2.5 py-1.5 flex items-center justify-between gap-2 border-b select-none font-mono text-xs"
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F1F5F9',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {isVideo ? (
                        <Tv size={12} className="text-sky-400 shrink-0" />
                      ) : item.type === 'hotspot' ? (
                        <Flame size={12} className="text-rose-400 shrink-0" />
                      ) : item.type === 'conflict' ? (
                        <Swords size={12} className="text-amber-400 shrink-0" />
                      ) : (
                        <FileText size={12} className="text-slate-400 shrink-0" />
                      )}

                      <span className="font-bold truncate text-[11px] text-[var(--text-primary)]">
                        {item.title}
                      </span>

                      {item.countryCode && (
                        <span className="text-[9.5px] text-sky-400/80 font-bold shrink-0">
                          [{item.countryCode}]
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Map Focus */}
                      {item.coordinates && (
                        <button
                          type="button"
                          onClick={() => onCenterMap(item.coordinates!)}
                          className="px-1.5 py-0.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[10px] font-mono font-semibold flex items-center gap-0.5 cursor-pointer"
                          title="Center Coordinates on Map"
                        >
                          <Crosshair size={10} />
                          <span>Map</span>
                        </button>
                      )}

                      {/* External Link */}
                      {(item.externalUrl || item.link) && (
                        <a
                          href={item.externalUrl || item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[var(--text-muted)] hover:text-sky-400 transition-colors"
                          title="Open External Source"
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {/* Remove Item */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(activeTabId, item.id)}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove from Workspace"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Item Content Body */}
                  <div className="p-2.5">
                    {/* VIDEO PLAYER */}
                    {isVideo && item.youtubeId ? (
                      <div>
                        <div
                          className="relative aspect-video w-full overflow-hidden rounded-[3px] shadow-inner mb-2"
                          style={{
                            background: '#05080F',
                            border: '1px solid rgba(56, 189, 248, 0.25)'
                          }}
                        >
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=0&rel=0`}
                            title={item.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--text-muted)]">
                          <span>{item.channel || 'Broadcast Wire'}</span>
                          {item.tags && item.tags.length > 0 && (
                            <span className="truncate max-w-[60%]">{item.tags.join(' • ')}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* INTEL DOSSIER / REPORT / HOTSPOT */
                      <div className="space-y-1.5 font-sans">
                        {item.summary && (
                          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed font-sans">
                            {item.summary}
                          </p>
                        )}

                        {item.description && (
                          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed font-sans">
                            {item.description}
                          </p>
                        )}

                        {item.parties && item.parties.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">BELLIGERENTS:</span>
                            {item.parties.map((p, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/25"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] border-t border-[var(--border-subtle)] mt-2">
                          <span>{item.source || item.subtitle || 'Tactical Feed'}</span>
                          <span>{item.timestamp || 'Real-time telemetry'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
