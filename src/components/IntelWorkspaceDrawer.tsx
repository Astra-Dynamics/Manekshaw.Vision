import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Radio,
  GripVertical,
  Columns,
  Rows,
  ArrowUp,
  ArrowDown,
  Sparkles,
  MoveHorizontal,
  MoveVertical
} from 'lucide-react';
import {
  WorkspaceDrawerTab,
  WorkspaceDrawerItem,
  WorkspaceRow,
  WorkspaceColumn,
  ThemeMode
} from '../types';
import { getYouTubeEmbedUrl } from '../utils/youtubeResolver';
import { LiveStreamCard } from './LiveStreamCard';

interface IntelWorkspaceDrawerProps {
  isOpen: boolean;
  isMinimized: boolean;
  isWholePage?: boolean;
  onToggleWholePage?: () => void;
  width: number;
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
  onResizeWidth?: (newWidth: number) => void;
  onUpdateRows?: (tabId: string, rows: WorkspaceRow[]) => void;
  isDraggingResizer?: boolean;
  onSetDraggingResizer?: (dragging: boolean) => void;
  onClearTab?: (tabId: string) => void;
  onCloseAllWorkspace?: () => void;
}

export type ActiveWorkspaceDropTarget =
  | {
      type: 'card';
      rowId: string;
      colId: string;
      direction: 'top' | 'bottom' | 'left' | 'right';
    }
  | {
      type: 'row_slot';
      targetRowIndex: number;
    };

interface WorkspaceHeaderButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  activeClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
  isLight?: boolean;
}

const WorkspaceHeaderButton: React.FC<WorkspaceHeaderButtonProps> = ({
  icon,
  label,
  active = false,
  activeClassName,
  onClick,
  title,
  className = '',
  isLight = false
}) => {
  const defaultActiveClassName = isLight
    ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] font-semibold border-[var(--accent)]/30 shadow-[var(--shadow-sm)]'
    : 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(56,189,248,0.35)]';

  const resolvedActiveClassName = activeClassName || defaultActiveClassName;

  const inactiveClassName = isLight
    ? 'text-[var(--text-secondary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-sunken)] hover:border-[var(--border-subtle)]'
    : 'text-[var(--text-muted)] hover:text-sky-400 hover:bg-white/[0.06] hover:border-white/10';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`group relative inline-flex items-center h-[26px] px-2 rounded transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap select-none font-mono text-[10px] shrink-0 border border-transparent ${
        active ? resolvedActiveClassName : inactiveClassName
      } ${className}`}
    >
      <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        {icon}
      </span>
      <span className="max-w-0 opacity-0 ml-0 overflow-hidden transition-[max-width,opacity,margin] duration-250 ease-out delay-0 group-hover:delay-200 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1 font-medium">
        {label}
      </span>
    </button>
  );
};

export const IntelWorkspaceDrawer: React.FC<IntelWorkspaceDrawerProps> = ({
  isOpen,
  isMinimized,
  isWholePage: isWholePageProp = false,
  onToggleWholePage,
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
  onCenterMap,
  onResizeWidth,
  onUpdateRows,
  isDraggingResizer = false,
  onSetDraggingResizer,
  onClearTab,
  onCloseAllWorkspace
}) => {
  const [internalWholePage, setInternalWholePage] = useState(false);
  const isWholePage = isWholePageProp || internalWholePage;
  const toggleWholePage = () => {
    if (onToggleWholePage) {
      onToggleWholePage();
    } else {
      setInternalWholePage((prev) => !prev);
    }
  };

  // Confirmation state for clearing tab elements and closing entire workspace
  const [isConfirmingClearTab, setIsConfirmingClearTab] = useState(false);
  const confirmClearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isConfirmingCloseAll, setIsConfirmingCloseAll] = useState(false);
  const confirmCloseAllTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isResizingDrawer, setIsResizingDrawer] = useState(false);
  
  // Notion-style 4-directional card and inter-row drop target state
  const [activeDropTarget, setActiveDropTarget] = useState<ActiveWorkspaceDropTarget | null>(null);

  const isDark = theme === 'dark';
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Derive and normalize rows for the 2D Notion-style block canvas
  const getNormalizedRows = useCallback((tab?: WorkspaceDrawerTab): WorkspaceRow[] => {
    if (!tab) return [];
    if (tab.rows && tab.rows.length > 0) return tab.rows;
    if (!tab.items || tab.items.length === 0) return [];

    return tab.items.map((item, idx) => ({
      rowId: `row_${item.id}_${idx}`,
      columns: [
        {
          id: `col_${item.id}_${idx}`,
          item,
          widthFlex: 1,
          customHeight: item.type === 'video' ? 240 : undefined
        }
      ]
    }));
  }, []);

  const [localRows, setLocalRows] = useState<WorkspaceRow[]>(() => getNormalizedRows(activeTab));

  useEffect(() => {
    setLocalRows(getNormalizedRows(activeTab));
  }, [activeTab, getNormalizedRows]);

  const updateRows = (newRows: WorkspaceRow[]) => {
    setLocalRows(newRows);
    if (onUpdateRows) {
      onUpdateRows(activeTabId, newRows);
    }
  };

  // Flattened items for badges & counts
  const allItems = localRows.flatMap((r) => r.columns.map((c) => c.item));
  const videoCount = allItems.filter((i) => i.type === 'video').length;

  // Reset tab confirmation when active tab changes
  useEffect(() => {
    setIsConfirmingClearTab(false);
  }, [activeTabId]);

  // Clean up confirmation timers on unmount
  useEffect(() => {
    return () => {
      if (confirmClearTimerRef.current) clearTimeout(confirmClearTimerRef.current);
      if (confirmCloseAllTimerRef.current) clearTimeout(confirmCloseAllTimerRef.current);
    };
  }, []);

  // Handle Clearing All Elements on Current Active Tab
  const handleClearActiveTab = () => {
    if (allItems.length === 0) return;
    if (!isConfirmingClearTab) {
      setIsConfirmingClearTab(true);
      if (confirmClearTimerRef.current) clearTimeout(confirmClearTimerRef.current);
      confirmClearTimerRef.current = setTimeout(() => {
        setIsConfirmingClearTab(false);
      }, 3500);
      return;
    }

    // Confirmed
    setIsConfirmingClearTab(false);
    if (confirmClearTimerRef.current) clearTimeout(confirmClearTimerRef.current);
    updateRows([]);
    if (onClearTab) {
      onClearTab(activeTabId);
    }
  };

  // Handle Closing & Clearing Entire Intel Workspace
  const handleCloseAllWorkspace = () => {
    const totalItemsAcrossAllTabs = tabs.reduce((acc, t) => {
      const rows = getNormalizedRows(t);
      return acc + rows.flatMap((r) => r.columns).length;
    }, 0);

    // If already empty and only 1 tab, close directly without confirmation
    if (totalItemsAcrossAllTabs === 0 && tabs.length <= 1) {
      onClose();
      return;
    }

    if (!isConfirmingCloseAll) {
      setIsConfirmingCloseAll(true);
      if (confirmCloseAllTimerRef.current) clearTimeout(confirmCloseAllTimerRef.current);
      confirmCloseAllTimerRef.current = setTimeout(() => {
        setIsConfirmingCloseAll(false);
      }, 3500);
      return;
    }

    // Confirmed
    setIsConfirmingCloseAll(false);
    if (confirmCloseAllTimerRef.current) clearTimeout(confirmCloseAllTimerRef.current);

    if (onCloseAllWorkspace) {
      onCloseAllWorkspace();
    } else {
      updateRows([]);
      onClose();
    }
  };

  // -------------------------------------------------------------
  // 1. Interactive Drawer Edge Drag-Resize (Width: 300px to 65vw)
  // -------------------------------------------------------------
  const handleStartDrawerResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingDrawer(true);
    if (onSetDraggingResizer) onSetDraggingResizer(true);

    const startX = e.clientX;
    const initialWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Dragging left increases width
      const deltaX = startX - moveEvent.clientX;
      const maxW = Math.min(window.innerWidth * 0.65, 1200);
      const newWidth = Math.max(300, Math.min(maxW, initialWidth + deltaX));
      if (onResizeWidth) {
        onResizeWidth(Math.round(newWidth));
      }
    };

    const handleMouseUp = () => {
      setIsResizingDrawer(false);
      if (onSetDraggingResizer) onSetDraggingResizer(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // -------------------------------------------------------------
  // 2. Canva-Style Card Height Resizer (Vertical Drag)
  // -------------------------------------------------------------
  const handleStartCardHeightResize = (
    rowId: string,
    colId: string,
    currentHeight: number | undefined,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const initialHeight = currentHeight || 240;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(130, Math.min(700, initialHeight + deltaY));

      setLocalRows((prevRows) =>
        prevRows.map((row) =>
          row.rowId === rowId
            ? {
                ...row,
                columns: row.columns.map((col) =>
                  col.id === colId ? { ...col, customHeight: Math.round(newHeight) } : col
                )
              }
            : row
        )
      );
    };

    const handleMouseUp = () => {
      if (onUpdateRows) {
        setLocalRows((latest) => {
          onUpdateRows(activeTabId, latest);
          return latest;
        });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // -------------------------------------------------------------
  // 3. Column Splitter Resizer (Adjust widthFlex within Row)
  // -------------------------------------------------------------
  const handleStartColumnSplitterResize = (
    rowId: string,
    colIdx: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const targetRow = localRows.find((r) => r.rowId === rowId);
    if (!targetRow || targetRow.columns.length < 2) return;

    const initialFlexA = targetRow.columns[colIdx]?.widthFlex || 1;
    const initialFlexB = targetRow.columns[colIdx + 1]?.widthFlex || 1;
    const totalFlex = initialFlexA + initialFlexB;

    const rowElement = (e.currentTarget.parentElement as HTMLElement);
    const rowWidth = rowElement ? rowElement.getBoundingClientRect().width : 400;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Convert pixel delta directly proportional to row width
      const flexShift = (deltaX / Math.max(200, rowWidth)) * totalFlex;
      const minFlex = 0.25;
      const newFlexA = Math.max(minFlex, Math.min(totalFlex - minFlex, initialFlexA + flexShift));
      const newFlexB = totalFlex - newFlexA;

      setLocalRows((prevRows) =>
        prevRows.map((row) => {
          if (row.rowId !== rowId) return row;
          const nextCols = [...row.columns];
          nextCols[colIdx] = { ...nextCols[colIdx], widthFlex: Number(newFlexA.toFixed(2)) };
          nextCols[colIdx + 1] = { ...nextCols[colIdx + 1], widthFlex: Number(newFlexB.toFixed(2)) };
          return { ...row, columns: nextCols };
        })
      );
    };

    const handleMouseUp = () => {
      if (onUpdateRows) {
        setLocalRows((latest) => {
          onUpdateRows(activeTabId, latest);
          return latest;
        });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // -------------------------------------------------------------
  // 3B. Bottom-Right Corner Resizer (Taller ↕ & Wider ↔)
  // -------------------------------------------------------------
  const handleStartCardCornerResize = (
    rowId: string,
    colId: string,
    colIdx: number,
    currentHeight: number | undefined,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialHeight = currentHeight || 240;

    const targetRow = localRows.find((r) => r.rowId === rowId);
    if (!targetRow) return;

    const hasSiblings = targetRow.columns.length > 1;
    const initialFlex = targetRow.columns[colIdx]?.widthFlex || 1;
    const rowElement = (e.currentTarget.closest('.flex.items-stretch') as HTMLElement);
    const rowWidth = rowElement ? rowElement.getBoundingClientRect().width : 400;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newHeight = Math.max(130, Math.min(800, initialHeight + deltaY));

      setLocalRows((prevRows) =>
        prevRows.map((row) => {
          if (row.rowId !== rowId) return row;

          if (hasSiblings) {
            // Reallocate widthFlex relative to row width
            const deltaFlex = (deltaX / Math.max(200, rowWidth)) * 2;
            const nextCols = row.columns.map((col) => {
              if (col.id === colId) {
                const adjustedFlex = Math.max(0.35, Math.min(2.5, initialFlex + deltaFlex));
                return { ...col, customHeight: Math.round(newHeight), widthFlex: Number(adjustedFlex.toFixed(2)) };
              }
              return col;
            });
            return { ...row, columns: nextCols };
          } else {
            return {
              ...row,
              columns: row.columns.map((col) =>
                col.id === colId ? { ...col, customHeight: Math.round(newHeight) } : col
              )
            };
          }
        })
      );

      // If standalone and stretched far to the right, expand workspace drawer width
      if (!hasSiblings && deltaX > 50 && onResizeWidth) {
        const candidateWidth = Math.min(window.innerWidth * 0.65, width + deltaX * 0.2);
        if (candidateWidth > width) {
          onResizeWidth(Math.round(candidateWidth));
        }
      }
    };

    const handleMouseUp = () => {
      if (onUpdateRows) {
        setLocalRows((latest) => {
          onUpdateRows(activeTabId, latest);
          return latest;
        });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // -------------------------------------------------------------
  // 3C. Quick-Toggle [ ⤢ Full Width / Split ]
  // -------------------------------------------------------------
  const handleToggleCardWidth = (rowId: string, colId: string) => {
    const targetRowIdx = localRows.findIndex((r) => r.rowId === rowId);
    if (targetRowIdx === -1) return;
    const targetRow = localRows[targetRowIdx];

    if (targetRow.columns.length > 1) {
      // Snap to 100% Full Width by extracting to standalone row
      splitColumnToOwnRow(rowId, colId);
    } else {
      // Snap to 50% Split Side-by-Side with adjacent row if available
      if (localRows.length > 1) {
        const neighborIdx = targetRowIdx < localRows.length - 1 ? targetRowIdx + 1 : targetRowIdx - 1;
        const neighborRow = localRows[neighborIdx];
        if (neighborRow.columns.length + targetRow.columns.length <= 3) {
          if (width < 560 && onResizeWidth) {
            onResizeWidth(560);
          }
          combineWithAdjacentRow(targetRowIdx, targetRowIdx < localRows.length - 1 ? 'next' : 'prev');
          return;
        }
      }
      // Toggle flex ratio directly if no neighbor row
      setLocalRows((prevRows) =>
        prevRows.map((r) =>
          r.rowId === rowId
            ? {
                ...r,
                columns: r.columns.map((c) =>
                  c.id === colId ? { ...c, widthFlex: c.widthFlex === 0.5 ? 1 : 0.5 } : c
                )
              }
            : r
        )
      );
    }
  };

  // -------------------------------------------------------------
  // 4. Notion-Style Block Reordering & Splitting
  // -------------------------------------------------------------
  const moveRow = (rowIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? rowIdx - 1 : rowIdx + 1;
    if (targetIdx < 0 || targetIdx >= localRows.length) return;
    const nextRows = [...localRows];
    const [moved] = nextRows.splice(rowIdx, 1);
    nextRows.splice(targetIdx, 0, moved);
    updateRows(nextRows);
  };

  const moveColumnWithinRow = (rowId: string, colIdx: number, direction: 'left' | 'right') => {
    const targetRow = localRows.find((r) => r.rowId === rowId);
    if (!targetRow) return;
    const targetIdx = direction === 'left' ? colIdx - 1 : colIdx + 1;
    if (targetIdx < 0 || targetIdx >= targetRow.columns.length) return;

    const nextRows = localRows.map((row) => {
      if (row.rowId !== rowId) return row;
      const nextCols = [...row.columns];
      const [moved] = nextCols.splice(colIdx, 1);
      nextCols.splice(targetIdx, 0, moved);
      return { ...row, columns: nextCols };
    });
    updateRows(nextRows);
  };

  // Split into own standalone row
  const splitColumnToOwnRow = (rowId: string, colId: string) => {
    const nextRows: WorkspaceRow[] = [];
    localRows.forEach((r) => {
      if (r.rowId === rowId) {
        const extractedCol = r.columns.find((c) => c.id === colId);
        const remainingCols = r.columns.filter((c) => c.id !== colId);
        if (remainingCols.length > 0) {
          nextRows.push({
            rowId: r.rowId,
            columns: remainingCols.map((c) => ({ ...c, widthFlex: 1 }))
          });
        }
        if (extractedCol) {
          nextRows.push({
            rowId: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            columns: [{ ...extractedCol, widthFlex: 1 }]
          });
        }
      } else {
        nextRows.push(r);
      }
    });
    updateRows(nextRows);
  };

  // Combine row with adjacent row into side-by-side columns
  const combineWithAdjacentRow = (rowIdx: number, direction: 'next' | 'prev') => {
    const targetIdx = direction === 'next' ? rowIdx + 1 : rowIdx - 1;
    if (targetIdx < 0 || targetIdx >= localRows.length) return;
    const currentRow = localRows[rowIdx];
    const targetRow = localRows[targetIdx];
    if (currentRow.columns.length + targetRow.columns.length > 3) return; // max 3 columns per row

    const combinedColumns = [...currentRow.columns, ...targetRow.columns].map((c) => ({
      ...c,
      widthFlex: 1
    }));
    const nextRows = localRows.filter((_, idx) => idx !== rowIdx && idx !== targetIdx);
    const insertIdx = Math.min(rowIdx, targetIdx);
    nextRows.splice(insertIdx, 0, {
      rowId: `row_merged_${Date.now()}`,
      columns: combinedColumns
    });
    updateRows(nextRows);
  };

  // Remove column / card
  const handleRemoveCard = (rowId: string, colId: string, itemId: string) => {
    const nextRows = localRows
      .map((row) => {
        if (row.rowId !== rowId) return row;
        const nextCols = row.columns.filter((c) => c.id !== colId);
        return { ...row, columns: nextCols };
      })
      .filter((row) => row.columns.length > 0);

    updateRows(nextRows);
    onRemoveItem(activeTabId, itemId);
  };

  // Set preset height
  const handleSetPresetHeight = (rowId: string, colId: string, height: number | undefined) => {
    const nextRows = localRows.map((row) =>
      row.rowId === rowId
        ? {
            ...row,
            columns: row.columns.map((col) =>
              col.id === colId ? { ...col, customHeight: height } : col
            )
          }
        : row
    );
    updateRows(nextRows);
  };

  // -------------------------------------------------------------
  // Canva-Style Drag Ghost Token
  // -------------------------------------------------------------
  const createCanvaDragGhost = (e: React.DragEvent, tokenType: string, label: string) => {
    const isLight = !isDark;
    const ghost = document.createElement('div');
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    ghost.style.left = '-1000px';
    ghost.style.width = '140px';
    ghost.style.height = '36px';
    ghost.style.background = isLight ? '#C6613F' : '#0EA5E9';
    ghost.style.color = isLight ? '#FFFFFF' : '#080C14';
    ghost.style.border = isLight ? '1px solid #FAF9F5' : '1px solid #F8FAFC';
    ghost.style.borderRadius = '4px';
    ghost.style.boxShadow = isLight ? '0 8px 20px rgba(31, 30, 29, 0.25)' : '0 12px 24px rgba(0, 0, 0, 0.7)';
    ghost.style.fontFamily = 'monospace';
    ghost.style.fontSize = '11px';
    ghost.style.fontWeight = '700';
    ghost.style.display = 'flex';
    ghost.style.alignItems = 'center';
    ghost.style.gap = '6px';
    ghost.style.padding = '0 10px';
    ghost.style.zIndex = '99999';
    ghost.style.pointerEvents = 'none';
    ghost.innerHTML = `<span style="background:${isLight ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'};padding:2px 4px;border-radius:2px;font-size:10px;">${tokenType}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:80px;">${label}</span>`;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 70, 18);
    setTimeout(() => {
      if (document.body.contains(ghost)) {
        document.body.removeChild(ghost);
      }
    }, 0);
  };

  // -------------------------------------------------------------
  // 2D Row/Column Placement Engine
  // -------------------------------------------------------------
  const insertColumnAtTarget = (
    rows: WorkspaceRow[],
    targetRowId: string,
    targetColId: string,
    colToInsert: WorkspaceColumn,
    direction: 'top' | 'bottom' | 'left' | 'right'
  ): WorkspaceRow[] => {
    const targetRowIndex = rows.findIndex((r) => r.rowId === targetRowId);
    if (targetRowIndex === -1) {
      return [
        ...rows,
        {
          rowId: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          columns: [colToInsert]
        }
      ];
    }

    const targetRow = rows[targetRowIndex];
    const targetColIndex = targetRow.columns.findIndex((c) => c.id === targetColId);

    if (direction === 'top') {
      // Insert as new standalone row immediately ABOVE target row
      const newRow: WorkspaceRow = {
        rowId: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        columns: [{ ...colToInsert, widthFlex: 1 }]
      };
      const nextRows = [...rows];
      nextRows.splice(targetRowIndex, 0, newRow);
      return nextRows;
    }

    if (direction === 'bottom') {
      // Insert as new standalone row immediately BELOW target row
      const newRow: WorkspaceRow = {
        rowId: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        columns: [{ ...colToInsert, widthFlex: 1 }]
      };
      const nextRows = [...rows];
      nextRows.splice(targetRowIndex + 1, 0, newRow);
      return nextRows;
    }

    // Side-by-side insertion ('left' or 'right')
    if (targetRow.columns.length >= 3) {
      // Max 3 columns per row reached: fallback gracefully to inserting as row above or below
      const fallbackDirection = direction === 'left' ? 'top' : 'bottom';
      return insertColumnAtTarget(rows, targetRowId, targetColId, colToInsert, fallbackDirection);
    }

    const nextCols = [...targetRow.columns];
    const insertIndex = direction === 'left' ? Math.max(0, targetColIndex) : targetColIndex + 1;
    nextCols.splice(insertIndex, 0, { ...colToInsert, widthFlex: 1 });

    const balancedCols = nextCols.map((c) => ({ ...c, widthFlex: 1 }));
    const nextRows = [...rows];
    nextRows[targetRowIndex] = {
      ...targetRow,
      columns: balancedCols
    };
    return nextRows;
  };

  // -------------------------------------------------------------
  // Drag Source: Existing Card Pick-Up (Six-Dot Handle ⋮⋮)
  // -------------------------------------------------------------
  const handleDragStartExistingCard = (
    e: React.DragEvent,
    sourceRowId: string,
    sourceColId: string,
    item: WorkspaceDrawerItem
  ) => {
    e.stopPropagation();
    const tokenType = item.type === 'video' ? '▶ VID' : item.type === 'hotspot' ? '🔥 HOT' : '📄 INTEL';
    createCanvaDragGhost(e, tokenType, item.title);

    const payload = {
      source: 'INTEL_WORKSPACE',
      sourceRowId,
      sourceColId,
      item
    };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  // -------------------------------------------------------------
  // Drag Target: Directional Hover Detection (Top, Bottom, Left, Right)
  // -------------------------------------------------------------
  const handleCardDragOver = (e: React.DragEvent, targetRowId: string, targetColId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const relX = Math.max(0, Math.min(1, x / w));
    const relY = Math.max(0, Math.min(1, y / h));

    let direction: 'top' | 'bottom' | 'left' | 'right';

    // Prioritize horizontal side-by-side splitting near edges (<= 22% or >= 78%)
    if (relX <= 0.22) {
      direction = 'left';
    } else if (relX >= 0.78) {
      direction = 'right';
    } else if (relY <= 0.28) {
      direction = 'top';
    } else if (relY >= 0.72) {
      direction = 'bottom';
    } else {
      // Central 50%: calculate closest edge
      const distTop = relY;
      const distBottom = 1 - relY;
      const distLeft = relX;
      const distRight = 1 - relX;
      const minDist = Math.min(distTop, distBottom, distLeft, distRight);

      if (minDist === distLeft) direction = 'left';
      else if (minDist === distRight) direction = 'right';
      else if (minDist === distTop) direction = 'top';
      else direction = 'bottom';
    }

    // Debounced state update: only update if target or direction actually changed
    if (
      activeDropTarget?.type !== 'card' ||
      activeDropTarget.rowId !== targetRowId ||
      activeDropTarget.colId !== targetColId ||
      activeDropTarget.direction !== direction
    ) {
      setActiveDropTarget({
        type: 'card',
        rowId: targetRowId,
        colId: targetColId,
        direction
      });
    }
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    const nextNode = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(nextNode)) {
      if (activeDropTarget?.type === 'card') {
        setActiveDropTarget(null);
      }
    }
  };

  // -------------------------------------------------------------
  // Card Drop: Directional Placement + Auto-Expand Width
  // -------------------------------------------------------------
  const handleCardDrop = (e: React.DragEvent, targetRowId: string, targetColId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const direction =
      activeDropTarget?.type === 'card' && activeDropTarget.direction
        ? activeDropTarget.direction
        : 'bottom';

    setActiveDropTarget(null);
    setIsDragOver(false);

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const parsed = JSON.parse(rawData);
      const item: WorkspaceDrawerItem = parsed.item;
      if (!item) return;

      // Auto-expand workspace width to >= 560px for side-by-side placement (when in drawer mode)
      if ((direction === 'left' || direction === 'right') && !isWholePage && width < 560 && onResizeWidth) {
        onResizeWidth(560);
      }

      const isInternalMove = parsed.source === 'INTEL_WORKSPACE' && parsed.sourceRowId && parsed.sourceColId;

      if (isInternalMove) {
        const { sourceRowId, sourceColId } = parsed;
        // If dropped on the exact same card in the same spot, do nothing
        if (sourceRowId === targetRowId && sourceColId === targetColId) {
          return;
        }

        // Step 1: Extract card from original position
        let movingCol: WorkspaceColumn | null = null;
        const rowsAfterExtraction = localRows
          .map((row) => {
            if (row.rowId !== sourceRowId) return row;
            const found = row.columns.find((c) => c.id === sourceColId);
            if (found) movingCol = found;
            const remaining = row.columns.filter((c) => c.id !== sourceColId);
            return { ...row, columns: remaining };
          })
          .filter((row) => row.columns.length > 0);

        if (!movingCol) {
          movingCol = {
            id: `col_${item.id}_${Date.now()}`,
            item,
            widthFlex: 1,
            customHeight: item.type === 'video' ? 240 : undefined
          };
        }

        // Step 2: Insert into rowsAfterExtraction at target position
        const updatedRows = insertColumnAtTarget(
          rowsAfterExtraction,
          targetRowId,
          targetColId,
          movingCol,
          direction
        );
        updateRows(updatedRows);
      } else {
        // Dropped from external Intelligence Desk
        const newCol: WorkspaceColumn = {
          id: `col_${item.id}_${Date.now()}`,
          item,
          widthFlex: 1,
          customHeight: item.type === 'video' ? 240 : undefined
        };

        const updatedRows = insertColumnAtTarget(
          localRows,
          targetRowId,
          targetColId,
          newCol,
          direction
        );
        updateRows(updatedRows);
        onDropItem(activeTabId, item);
      }
    } catch (err) {
      console.warn('handleCardDrop error:', err);
    }
  };

  // -------------------------------------------------------------
  // Row Slot Drop: Precision Inter-Row & Top Placement (Zero Flicker)
  // -------------------------------------------------------------
  const handleRowSlotDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropTarget(null);
    setIsDragOver(false);

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const parsed = JSON.parse(rawData);
      const item: WorkspaceDrawerItem = parsed.item;
      if (!item) return;

      const isInternalMove = parsed.source === 'INTEL_WORKSPACE' && parsed.sourceRowId && parsed.sourceColId;

      if (isInternalMove) {
        const { sourceRowId, sourceColId } = parsed;
        let movingCol: WorkspaceColumn | null = null;

        const rowsAfterExtraction = localRows
          .map((row) => {
            if (row.rowId !== sourceRowId) return row;
            const found = row.columns.find((c) => c.id === sourceColId);
            if (found) movingCol = found;
            const remaining = row.columns.filter((c) => c.id !== sourceColId);
            return { ...row, columns: remaining };
          })
          .filter((row) => row.columns.length > 0);

        if (!movingCol) {
          movingCol = {
            id: `col_${item.id}_${Date.now()}`,
            item,
            widthFlex: 1,
            customHeight: item.type === 'video' ? 240 : undefined
          };
        }

        const validCol: WorkspaceColumn = movingCol;
        const newRow: WorkspaceRow = {
          rowId: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          columns: [{ ...validCol, widthFlex: 1 }]
        };

        const clampedIndex = Math.max(0, Math.min(targetIndex, rowsAfterExtraction.length));
        const updated = [...rowsAfterExtraction];
        updated.splice(clampedIndex, 0, newRow);
        updateRows(updated);
      } else {
        const newCol: WorkspaceColumn = {
          id: `col_${item.id}_${Date.now()}`,
          item,
          widthFlex: 1,
          customHeight: item.type === 'video' ? 240 : undefined
        };
        const newRow: WorkspaceRow = {
          rowId: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          columns: [newCol]
        };

        const clampedIndex = Math.max(0, Math.min(targetIndex, localRows.length));
        const updated = [...localRows];
        updated.splice(clampedIndex, 0, newRow);
        updateRows(updated);
        onDropItem(activeTabId, item);
      }
    } catch (err) {
      console.warn('handleRowSlotDrop error:', err);
    }
  };

  // -------------------------------------------------------------
  // Canvas Drop: Append to End of Canvas
  // -------------------------------------------------------------
  const handleCanvasDrop = (e: React.DragEvent) => {
    handleRowSlotDrop(e, localRows.length);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = () => {
    // No-op to avoid flickering
  };

  const handleStartRename = (e: React.MouseEvent, tab: WorkspaceDrawerTab) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditingTitle(tab.title);
  };

  const handleSaveRename = (tabId: string) => {
    if (editingTitle.trim()) {
      onRenameTab(tabId, editingTitle.trim());
    }
    setEditingTabId(null);
  };

  if (!isOpen) return null;

  // Minimized Slim Vertical Rail
  if (isMinimized) {
    return (
      <div
        onClick={onToggleMinimize}
        className="absolute top-[76px] bottom-0 right-0 z-35 flex flex-col items-center py-4 gap-4 cursor-pointer transition-all border-l shadow-2xl select-none"
        style={{
          width: '36px',
          background: isDark ? 'rgba(7, 10, 18, 0.96)' : 'var(--bg-panel)',
          borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'var(--border-subtle)',
          boxShadow: isDark ? undefined : '-2px 0 12px rgba(31, 30, 29, 0.05)'
        }}
        title="Expand Intel Workspace (<<)"
      >
        <div className={`w-5 h-5 rounded-[3px] flex items-center justify-center ${
          isDark
            ? 'bg-sky-500/15 border border-sky-500/40 text-sky-400'
            : 'bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent-text)]'
        }`}>
          <Radio size={12} className="animate-pulse" />
        </div>
        <div
          className={`font-mono text-[10px] font-bold tracking-wider uppercase select-none ${
            isDark ? 'text-slate-300' : 'text-[var(--text-secondary)]'
          }`}
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          INTEL WORKSPACE ({allItems.length})
        </div>
        <button
          type="button"
          className={`p-1 rounded transition-colors ${
            isDark
              ? 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20'
              : 'bg-[var(--bg-sunken)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)]'
          }`}
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
      onDrop={(e) => handleCanvasDrop(e)}
      className="absolute top-[76px] bottom-0 right-0 flex flex-col shadow-2xl select-none cq-panel"
      style={{
        left: isWholePage ? 0 : undefined,
        right: 0,
        width: isWholePage ? '100vw' : `${width}px`,
        maxWidth: '100vw',
        zIndex: isWholePage ? 45 : 35,
        background: isDark ? 'var(--bg-surface)' : 'var(--bg-app)',
        borderLeft: isWholePage ? 'none' : isDark ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
        boxShadow: isWholePage ? 'none' : isDark ? '-16px 0 32px rgba(0, 0, 0, 0.65)' : '-8px 0 24px rgba(31, 30, 29, 0.08)',
        transition: isDraggingResizer || isResizingDrawer ? 'none' : 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* Interactive Left-Edge Drag-Resize Gutter (Hidden in Whole Page Mode) */}
      {/* ------------------------------------------------------------- */}
      {!isWholePage && (
        <div
          onMouseDown={handleStartDrawerResize}
          className="absolute left-0 top-0 bottom-0 w-[6px] -translate-x-[3px] z-50 cursor-ew-resize group select-none flex items-center justify-center"
          title="Drag left/right to resize Intel Workspace (300px - 65vw)"
        >
          {/* Glowing Highlight line */}
          <div
            className={`w-[2px] h-full transition-all ${
              isDark
                ? isResizingDrawer || isDraggingResizer
                  ? 'bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]'
                  : 'bg-transparent group-hover:bg-[#38BDF8]/60 group-hover:shadow-[0_0_8px_#38BDF8]'
                : isResizingDrawer || isDraggingResizer
                  ? 'bg-[var(--accent)] shadow-[0_0_8px_rgba(198,97,63,0.4)]'
                  : 'bg-transparent group-hover:bg-[var(--accent)]/50'
            }`}
          />

          {/* Centered Pill Grip Icon */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-8 rounded-full flex items-center justify-center transition-all ${
              isDark
                ? isResizingDrawer || isDraggingResizer
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_#38BDF8]'
                  : 'bg-slate-900/95 text-slate-400 border border-slate-700/80 group-hover:border-sky-400 group-hover:text-sky-300'
                : isResizingDrawer || isDraggingResizer
                  ? 'bg-[var(--accent)] text-white shadow-[0_0_8px_rgba(198,97,63,0.35)]'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border-strong)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent-text)] shadow-sm'
            }`}
          >
            <GripVertical size={11} />
          </div>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <div
        className="h-10 px-3 flex items-center justify-between shrink-0 border-b select-none font-mono text-xs"
        style={{
          background: isDark ? 'rgba(8, 12, 20, 0.95)' : 'var(--bg-panel)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        {/* Left: Emblem + Title + Count */}
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-[3px] flex items-center justify-center ${
            isDark
              ? 'bg-sky-500/15 border border-sky-500/40 text-sky-400'
              : 'bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent-text)]'
          }`}>
            <Radio size={12} className="animate-pulse" />
          </div>
          <span className={`font-bold tracking-wider uppercase text-[11px] ${
            isDark ? 'text-slate-100' : 'text-[var(--text-primary)] font-serif'
          }`}>
            INTEL WORKSPACE
          </span>
          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
            isDark
              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
              : 'bg-[var(--bg-sunken)] text-[var(--accent-text)] border border-[var(--border-subtle)]'
          }`}>
            {allItems.length} {allItems.length === 1 ? 'ITEM' : 'ITEMS'}
          </span>
          <span className={`hidden sm:inline-block text-[9.5px] font-mono ${
            isDark ? 'text-slate-500' : 'text-[var(--text-tertiary)]'
          }`}>
            {isWholePage ? 'WHOLE PAGE (100vw)' : `${width}px`}
          </span>
        </div>

        {/* Right: Individual Hover-Expandable Micro-Pill Dock (Whole Page, Close All, Width, Minimize, Close) */}
        <div className={`flex items-center gap-1 p-0.5 rounded border ${
          isDark ? 'border-white/10 bg-black/20' : 'border-[var(--border-subtle)] bg-[var(--surface)] shadow-xs'
        }`}>
          {/* 1. Whole Page Extension Button (Hover Expandable with 0.2s delay) */}
          <WorkspaceHeaderButton
            icon={isWholePage ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
            label={isWholePage ? 'DRAWER VIEW' : 'WHOLE PAGE'}
            active={isWholePage}
            onClick={toggleWholePage}
            title={isWholePage ? 'Restore Drawer Mode (⤡)' : 'Expand Workspace to Whole Page (⤢)'}
            isLight={!isDark}
          />

          {/* 2. Close All Button for Whole Intel Workspace (Hover Expandable with 0.2s delay) */}
          <WorkspaceHeaderButton
            icon={<Trash2 size={11} className={isConfirmingCloseAll ? 'text-white' : ''} />}
            label={isConfirmingCloseAll ? 'CONFIRM CLOSE ALL?' : 'CLOSE ALL'}
            active={isConfirmingCloseAll}
            activeClassName={
              isDark
                ? "bg-rose-500 text-white font-bold animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)] border-rose-500"
                : "bg-[var(--sev-critical)] text-white font-bold animate-pulse shadow-sm border-[var(--sev-critical)]"
            }
            className={
              isConfirmingCloseAll
                ? ''
                : isDark
                ? 'hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30'
                : 'hover:text-[var(--sev-critical)] hover:bg-[var(--sev-critical-bg)] hover:border-[var(--sev-critical)]/30'
            }
            onClick={handleCloseAllWorkspace}
            title="Close all tabs and clear entire Intel Workspace"
            isLight={!isDark}
          />

          {/* 3. Toggle Preset Width (Only visible in Drawer mode) */}
          {!isWholePage && (
            <WorkspaceHeaderButton
              icon={width >= 600 ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
              label={width >= 600 ? 'COMPACT (440px)' : 'EXPAND (680px)'}
              onClick={onToggleWidth}
              title={width >= 600 ? 'Shrink to 440px Compact' : 'Expand to 680px Wide Canvas'}
              isLight={!isDark}
            />
          )}

          {/* 4. Minimize to Slim Vertical Rail */}
          <WorkspaceHeaderButton
            icon={<ChevronRight size={13} />}
            label="MINIMIZE"
            onClick={onToggleMinimize}
            className={isDark ? "hover:text-amber-400" : "hover:text-[var(--accent-text)]"}
            title="Minimize to Edge Rail (>>)"
            isLight={!isDark}
          />

          {/* 5. Close Drawer */}
          <WorkspaceHeaderButton
            icon={<X size={13} />}
            label="CLOSE"
            onClick={onClose}
            className={isDark ? "hover:text-rose-400" : "hover:text-[var(--sev-critical)]"}
            title="Close Workspace (×)"
            isLight={!isDark}
          />
        </div>
      </div>

      {/* 2. Drawer Multi-Tab Bar */}
      <div
        className="h-8 px-2 flex items-end gap-1 shrink-0 overflow-x-auto select-none font-mono text-[11px]"
        style={{
          background: isDark ? 'rgba(6, 9, 15, 0.96)' : 'var(--bg-sunken)',
          borderBottom: '1px solid var(--border-subtle)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isEditing = editingTabId === tab.id;
          const rowsForTab = getNormalizedRows(tab);
          const tabItemCount = rowsForTab.flatMap((r) => r.columns).length;

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
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                background: isActive
                  ? isDark
                    ? 'var(--bg-surface)'
                    : 'var(--surface)'
                  : 'transparent',
                color: isActive
                  ? isDark
                    ? '#38bdf8'
                    : 'var(--text-primary)'
                  : isDark
                  ? '#94A3B8'
                  : 'var(--text-secondary)',
                border: isActive
                  ? isDark
                    ? '1px solid rgba(56, 189, 248, 0.35)'
                    : '1px solid var(--border-subtle)'
                  : '1px solid transparent',
                borderBottom: isActive
                  ? isDark
                    ? '1px solid var(--bg-surface)'
                    : '1px solid var(--surface)'
                  : 'none',
                boxShadow: isActive && !isDark ? '0 -1px 3px rgba(31,30,29,0.03)' : undefined
              }}
            >
              {isEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleSaveRename(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename(tab.id);
                    if (e.key === 'Escape') setEditingTabId(null);
                  }}
                  className={`w-full bg-transparent text-[11px] font-mono outline-none ${
                    isDark ? 'text-sky-400' : 'text-[var(--accent-text)]'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span className={`truncate tracking-wide text-[10.5px] ${
                    isActive ? (isDark ? 'font-semibold' : 'font-bold') : 'font-medium'
                  }`}>
                    {tab.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[9px] px-1 py-0.1 rounded ${
                      isDark
                        ? 'bg-white/5 text-slate-400'
                        : 'bg-[var(--bg-panel)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]'
                    }`}>
                      {tabItemCount}
                    </span>
                    {tabs.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseTab(tab.id);
                        }}
                        className={`opacity-0 group-hover:opacity-100 p-0.5 transition-opacity ${
                          isDark ? 'hover:text-rose-400' : 'hover:text-[var(--sev-critical)]'
                        }`}
                        title="Close Tab"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          type="button"
          onClick={onNewTab}
          className={`h-[24px] px-1.5 rounded flex items-center justify-center transition-colors shrink-0 mb-0.5 ${
            isDark
              ? 'hover:bg-white/[0.06] text-slate-400 hover:text-sky-400'
              : 'text-[var(--text-secondary)] hover:text-[var(--accent-text)] hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border-subtle)]'
          }`}
          title="Create New Intel Watch Tab (+)"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* 2.5 Active Tab Control Strip (Just below the tabs: Tab name + Clear All) */}
      <div
        className="h-7 px-3 flex items-center justify-between shrink-0 select-none font-mono text-[10px]"
        style={{
          background: isDark ? 'rgba(8, 12, 20, 0.88)' : 'var(--bg-panel)',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid var(--border-subtle)'
        }}
      >
        {/* Left: Active Tab Indicator & Item Count */}
        <div className="flex items-center gap-1.5 truncate pr-2">
          <span className={`text-[9px] uppercase tracking-wider ${isDark ? 'text-[var(--text-muted)]' : 'text-[var(--text-tertiary)]'}`}>
            ACTIVE TAB:
          </span>
          <span className={`font-bold truncate max-w-[180px] sm:max-w-[260px] ${
            isDark ? 'text-sky-400' : 'text-[var(--accent-text)]'
          }`}>
            {activeTab.title}
          </span>
          <span className={`text-[9px] ${isDark ? 'text-[var(--text-muted)]' : 'text-[var(--text-tertiary)]'}`}>
            • {allItems.length} {allItems.length === 1 ? 'element' : 'elements'}
          </span>
        </div>

        {/* Right: Clear All Elements for Current Tab */}
        <button
          type="button"
          onClick={handleClearActiveTab}
          disabled={allItems.length === 0}
          className={`px-2 py-0.5 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all ${
            allItems.length === 0
              ? isDark
                ? 'opacity-35 cursor-not-allowed text-slate-500'
                : 'opacity-35 cursor-not-allowed text-[var(--text-tertiary)] border border-[var(--border-subtle)] bg-[var(--surface)]'
              : isConfirmingClearTab
              ? isDark
                ? 'bg-rose-500 text-white font-bold animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)] cursor-pointer'
                : 'bg-[var(--sev-critical)] text-white font-bold animate-pulse shadow-sm border border-[var(--sev-critical)] cursor-pointer'
              : isDark
              ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 cursor-pointer'
              : 'text-[var(--text-secondary)] hover:text-[var(--sev-critical)] bg-[var(--surface)] hover:bg-[var(--sev-critical-bg)] border border-[var(--border-subtle)] hover:border-[var(--sev-critical)]/30 cursor-pointer shadow-xs'
          }`}
          title={allItems.length === 0 ? 'No elements to clear on this tab' : `Clear all elements on "${activeTab.title}"`}
        >
          <Trash2 size={10} className={isConfirmingClearTab ? 'text-white' : ''} />
          <span>{isConfirmingClearTab ? 'CONFIRM CLEAR ALL?' : 'CLEAR ALL'}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Notion + Canva 2D Block Canvas (Rows with 1 to 3 Columns)  */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`flex-1 overflow-y-auto feed-scrollbar ${
          isWholePage ? 'px-6 sm:px-12 py-6 max-w-[1600px] mx-auto w-full' : 'p-3'
        }`}
      >
        {localRows.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = 'copy';
              if (activeDropTarget?.type !== 'row_slot' || activeDropTarget.targetRowIndex !== 0) {
                setActiveDropTarget({ type: 'row_slot', targetRowIndex: 0 });
              }
            }}
            onDragLeave={() => setActiveDropTarget(null)}
            onDrop={(e) => handleRowSlotDrop(e, 0)}
            className={`h-full min-h-[260px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl transition-all ${
              isDark
                ? activeDropTarget?.type === 'row_slot'
                  ? 'border-sky-400 bg-sky-500/10 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : 'border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700'
                : activeDropTarget?.type === 'row_slot'
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]/50 text-[var(--accent-text)] shadow-md'
                  : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-tertiary)] hover:border-[var(--accent)]/50 shadow-[var(--shadow-sm)]'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              isDark
                ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400'
                : 'bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent-text)]'
            }`}>
              <Radio size={20} className="animate-pulse" />
            </div>
            <div className={`font-mono text-xs font-bold tracking-wider uppercase mb-1 ${
              isDark ? 'text-slate-200' : 'text-[var(--text-primary)] font-serif'
            }`}>
              WORKSPACE CANVAS IS EMPTY
            </div>
            <p className={`font-sans text-[11px] max-w-[320px] ${
              isDark ? 'text-slate-500' : 'text-[var(--text-secondary)]'
            }`}>
              Drag and drop any intelligence item or video broadcast here to mount your first 2D block.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Top Drop Slot (Before Row 0) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                if (activeDropTarget?.type !== 'row_slot' || activeDropTarget.targetRowIndex !== 0) {
                  setActiveDropTarget({ type: 'row_slot', targetRowIndex: 0 });
                }
              }}
              onDragLeave={(e) => {
                const nextNode = e.relatedTarget as Node | null;
                if (!e.currentTarget.contains(nextNode)) {
                  if (activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === 0) {
                    setActiveDropTarget(null);
                  }
                }
              }}
              onDrop={(e) => handleRowSlotDrop(e, 0)}
              className="relative py-2.5 -mt-1.5 mb-1 z-30 cursor-pointer group"
            >
              <div
                className={`h-[3px] rounded-full transition-all flex items-center justify-center relative ${
                  isDark
                    ? activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === 0
                      ? 'bg-[#38BDF8] shadow-[0_0_14px_#38BDF8] opacity-100 scale-y-125'
                      : 'bg-transparent opacity-0 group-hover:bg-sky-400/25 group-hover:opacity-60'
                    : activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === 0
                      ? 'bg-[var(--accent)] shadow-[0_0_10px_rgba(198,97,63,0.35)] opacity-100 scale-y-125'
                      : 'bg-transparent opacity-0 group-hover:bg-[var(--accent)]/25 group-hover:opacity-60'
                }`}
              >
                {activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === 0 && (
                  <span className={`absolute -top-3.5 px-3 py-0.5 rounded-full text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 z-50 pointer-events-none whitespace-nowrap ${
                    isDark ? 'bg-[#0284C7]' : 'bg-[var(--accent)]'
                  }`}>
                    <ArrowUp size={10} /> INSERT NEW ROW AT TOP
                  </span>
                )}
              </div>
            </div>

            {localRows.map((row, rowIdx) => {
              const colCount = row.columns.length;

              return (
                <React.Fragment key={row.rowId}>
                  <div
                    className={`relative group/row rounded-xl border p-1.5 transition-all ${
                      isDark
                        ? 'border-slate-800/90 bg-[#090d16]/70 hover:border-slate-700 shadow-md'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-panel)] hover:border-[var(--border-strong)] shadow-[var(--shadow-sm)]'
                    }`}
                  >
                {/* Row Controls Bar (Notion Style Block Actions) */}
                <div className={`flex items-center justify-between px-1.5 py-1 mb-1 text-[10px] font-mono border-b ${
                  isDark ? 'text-slate-500 border-white/[0.04]' : 'text-[var(--text-tertiary)] border-[var(--border-subtle)]'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold uppercase tracking-wider text-[9px] ${
                      isDark ? 'text-slate-400' : 'text-[var(--text-secondary)] font-semibold'
                    }`}>
                      ROW {rowIdx + 1}
                    </span>
                    <span className={`text-[9px] px-1 py-0.2 rounded ${
                      isDark ? 'bg-white/5 text-slate-400' : 'bg-[var(--bg-sunken)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]'
                    }`}>
                      {colCount} {colCount === 1 ? 'COL' : 'COLS'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-60 group-hover/row:opacity-100 transition-opacity">
                    {/* Move Row Up */}
                    <button
                      type="button"
                      disabled={rowIdx === 0}
                      onClick={() => moveRow(rowIdx, 'up')}
                      className={`p-0.5 disabled:opacity-20 cursor-pointer ${
                        isDark ? 'hover:text-sky-400 text-slate-400' : 'hover:text-[var(--accent-text)] text-[var(--text-secondary)]'
                      }`}
                      title="Move Row Up"
                    >
                      <ArrowUp size={11} />
                    </button>

                    {/* Move Row Down */}
                    <button
                      type="button"
                      disabled={rowIdx === localRows.length - 1}
                      onClick={() => moveRow(rowIdx, 'down')}
                      className={`p-0.5 disabled:opacity-20 cursor-pointer ${
                        isDark ? 'hover:text-sky-400 text-slate-400' : 'hover:text-[var(--accent-text)] text-[var(--text-secondary)]'
                      }`}
                      title="Move Row Down"
                    >
                      <ArrowDown size={11} />
                    </button>

                    {/* Combine with Next Row as side-by-side columns */}
                    {rowIdx < localRows.length - 1 && colCount + localRows[rowIdx + 1].columns.length <= 3 && (
                      <button
                        type="button"
                        onClick={() => combineWithAdjacentRow(rowIdx, 'next')}
                        className={`px-1 py-0.5 rounded text-[9px] flex items-center gap-0.5 cursor-pointer ml-1 ${
                          isDark
                            ? 'bg-white/5 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300'
                            : 'bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-text)] text-[var(--text-secondary)] shadow-xs'
                        }`}
                        title="Merge with Row Below Side-by-Side"
                      >
                        <Columns size={10} />
                        <span>Merge ◫</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Columns Flex Layout Container */}
                <div className="flex items-stretch gap-2 relative">
                  {row.columns.map((col, colIdx) => {
                    const item = col.item;
                    const isVideo = item.type === 'video';
                    const customHeight = col.customHeight;

                    return (
                      <React.Fragment key={col.id}>
                        {/* Interactive Horizontal Column Splitter Handle (Between Columns: ↔) */}
                        {colIdx > 0 && (
                          <div
                            onMouseDown={(e) => handleStartColumnSplitterResize(row.rowId, colIdx - 1, e)}
                            className={`w-2.5 hover:w-3.5 cursor-col-resize transition-all select-none flex items-center justify-center -mx-1 z-30 group/split shrink-0 self-stretch relative ${
                              isDark ? 'hover:bg-sky-400/25' : 'hover:bg-[var(--accent)]/20'
                            }`}
                            title="Drag horizontally to adjust column widths (↔)"
                          >
                            {/* Glowing vertical line */}
                            <div className={`w-[2px] h-full transition-all ${
                              isDark
                                ? 'bg-slate-800 group-hover/split:bg-[#38BDF8] group-hover/split:shadow-[0_0_10px_#38BDF8]'
                                : 'bg-[var(--border-strong)] group-hover/split:bg-[var(--accent)] group-hover/split:shadow-[0_0_8px_rgba(198,97,63,0.35)]'
                            }`} />

                            {/* Centered pill grip icon */}
                            <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-6 rounded-full border flex items-center justify-center transition-all shadow-md pointer-events-none ${
                              isDark
                                ? 'bg-slate-900 border-slate-700 group-hover/split:border-sky-400 group-hover/split:bg-sky-500 text-slate-400 group-hover/split:text-slate-950'
                                : 'bg-[var(--surface)] border-[var(--border-strong)] group-hover/split:border-[var(--accent)] group-hover/split:bg-[var(--accent)] text-[var(--text-secondary)] group-hover/split:text-white'
                            }`}>
                              <MoveHorizontal size={9} />
                            </div>
                          </div>
                        )}

                        {/* Card Container with Notion 4-Directional Drop Zones */}
                        <div
                          onDragOver={(e) => handleCardDragOver(e, row.rowId, col.id)}
                          onDragLeave={handleCardDragLeave}
                          onDrop={(e) => handleCardDrop(e, row.rowId, col.id)}
                          style={{
                            flex: col.widthFlex || 1,
                            minWidth: '220px'
                          }}
                          className={`relative flex flex-col rounded-xl border group/card transition-all ${
                            isDark
                              ? activeDropTarget?.type === 'card' &&
                                activeDropTarget.rowId === row.rowId &&
                                activeDropTarget.colId === col.id
                                ? 'border-sky-400 ring-1 ring-sky-400/40 shadow-[0_0_18px_rgba(56,189,248,0.25)] bg-[#0c121e]'
                                : 'border-slate-800 hover:border-slate-700 bg-[#0c121e] shadow-lg'
                              : activeDropTarget?.type === 'card' &&
                                activeDropTarget.rowId === row.rowId &&
                                activeDropTarget.colId === col.id
                                ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/40 shadow-md bg-[var(--surface)]'
                                : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]'
                          }`}
                        >
                          {/* 4-Directional Glowing Drop Indicators */}
                          {activeDropTarget?.type === 'card' &&
                            activeDropTarget.rowId === row.rowId &&
                            activeDropTarget.colId === col.id && (
                            <>
                              {activeDropTarget.direction === 'top' && (
                                <div className="absolute -top-[3px] left-0 right-0 z-50 pointer-events-none flex items-center justify-center">
                                  <div className={`w-full h-[3px] rounded-full animate-pulse ${
                                    isDark ? 'bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]' : 'bg-[var(--accent)] shadow-[0_0_10px_rgba(198,97,63,0.4)]'
                                  }`} />
                                  <span className={`absolute -top-5 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md whitespace-nowrap ${
                                    isDark ? 'bg-[#0EA5E9] text-[#080C14]' : 'bg-[var(--accent)] text-white'
                                  }`}>
                                    ↑ INSERT NEW ROW ABOVE
                                  </span>
                                </div>
                              )}
                              {activeDropTarget.direction === 'bottom' && (
                                <div className="absolute -bottom-[3px] left-0 right-0 z-50 pointer-events-none flex items-center justify-center">
                                  <div className={`w-full h-[3px] rounded-full animate-pulse ${
                                    isDark ? 'bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]' : 'bg-[var(--accent)] shadow-[0_0_10px_rgba(198,97,63,0.4)]'
                                  }`} />
                                  <span className={`absolute -bottom-5 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md whitespace-nowrap ${
                                    isDark ? 'bg-[#0EA5E9] text-[#080C14]' : 'bg-[var(--accent)] text-white'
                                  }`}>
                                    ↓ INSERT NEW ROW BELOW
                                  </span>
                                </div>
                              )}
                              {activeDropTarget.direction === 'left' && (
                                <div className="absolute top-0 bottom-0 -left-[3px] z-50 pointer-events-none flex items-center justify-center">
                                  <div className={`h-full w-[3px] rounded-full animate-pulse ${
                                    isDark ? 'bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]' : 'bg-[var(--accent)] shadow-[0_0_10px_rgba(198,97,63,0.4)]'
                                  }`} />
                                  <span className={`absolute -left-2 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md whitespace-nowrap z-50 ${
                                    isDark ? 'bg-[#0EA5E9] text-[#080C14]' : 'bg-[var(--accent)] text-white'
                                  }`}>
                                    ← PLACE SIDE-BY-SIDE (LEFT)
                                  </span>
                                </div>
                              )}
                              {activeDropTarget.direction === 'right' && (
                                <div className="absolute top-0 bottom-0 -right-[3px] z-50 pointer-events-none flex items-center justify-center">
                                  <div className={`h-full w-[3px] rounded-full animate-pulse ${
                                    isDark ? 'bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]' : 'bg-[var(--accent)] shadow-[0_0_10px_rgba(198,97,63,0.4)]'
                                  }`} />
                                  <span className={`absolute -right-2 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-md whitespace-nowrap z-50 ${
                                    isDark ? 'bg-[#0EA5E9] text-[#080C14]' : 'bg-[var(--accent)] text-white'
                                  }`}>
                                    → PLACE SIDE-BY-SIDE (RIGHT)
                                  </span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Card Header Bar */}
                          <div
                            className={`px-2.5 py-1.5 flex items-center justify-between gap-1.5 border-b text-xs font-mono select-none rounded-t-xl ${
                              isDark
                                ? 'border-slate-800 bg-[#090e17]'
                                : 'border-[var(--border-subtle)] bg-[var(--surface)]'
                            }`}
                          >
                            {/* Left: Notion Six-Dot Drag Handle (⋮⋮) + Icon + Title */}
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <div
                                draggable="true"
                                onDragStart={(e) => handleDragStartExistingCard(e, row.rowId, col.id, item)}
                                className={`px-1 py-0.5 -ml-1 rounded cursor-grab active:cursor-grabbing shrink-0 transition-all flex items-center justify-center select-none ${
                                  isDark
                                    ? 'text-slate-500 hover:text-sky-300 hover:bg-white/10'
                                    : 'text-[var(--text-tertiary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-sunken)]'
                                }`}
                                title="Drag card to move anywhere (Notion 4-directional grip)"
                              >
                                <span className="font-mono text-[13px] leading-none select-none tracking-[-2px] font-bold">⋮⋮</span>
                              </div>

                              {isVideo ? (
                                <Tv size={12} className={isDark ? "text-sky-400 shrink-0" : "text-[var(--accent-text)] shrink-0"} />
                              ) : item.type === 'hotspot' ? (
                                <Flame size={12} className={isDark ? "text-rose-400 shrink-0" : "text-[var(--sev-critical)] shrink-0"} />
                              ) : item.type === 'conflict' ? (
                                <Swords size={12} className={isDark ? "text-amber-400 shrink-0" : "text-[var(--sev-high)] shrink-0"} />
                              ) : (
                                <FileText size={12} className={isDark ? "text-slate-400 shrink-0" : "text-[var(--text-secondary)] shrink-0"} />
                              )}

                              <span className={`truncate text-[11px] ${
                                isDark ? 'font-bold text-slate-100' : 'font-serif font-semibold text-[var(--text-primary)]'
                              }`}>
                                {item.title}
                              </span>

                              {item.countryCode && (
                                <span className={`text-[9px] font-bold shrink-0 ${
                                  isDark ? 'text-sky-400/90' : 'text-[var(--accent-text)] font-semibold'
                                }`}>
                                  [{item.countryCode}]
                                </span>
                              )}
                            </div>

                            {/* Right: Card Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              {/* Move Left / Right inside row */}
                              {colCount > 1 && (
                                <>
                                  {colIdx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => moveColumnWithinRow(row.rowId, colIdx, 'left')}
                                      className={`p-0.5 cursor-pointer ${
                                        isDark ? 'text-slate-400 hover:text-sky-400' : 'text-[var(--text-secondary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-sunken)] rounded'
                                      }`}
                                      title="Move Column Left"
                                    >
                                      <ChevronLeft size={11} />
                                    </button>
                                  )}
                                  {colIdx < colCount - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => moveColumnWithinRow(row.rowId, colIdx, 'right')}
                                      className={`p-0.5 cursor-pointer ${
                                        isDark ? 'text-slate-400 hover:text-sky-400' : 'text-[var(--text-secondary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-sunken)] rounded'
                                      }`}
                                      title="Move Column Right"
                                    >
                                      <ChevronRight size={11} />
                                    </button>
                                  )}
                                  {/* Split to own row */}
                                  <button
                                    type="button"
                                    onClick={() => splitColumnToOwnRow(row.rowId, col.id)}
                                    className={`p-0.5 cursor-pointer ${
                                      isDark ? 'text-slate-400 hover:text-sky-400' : 'text-[var(--text-secondary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-sunken)] rounded'
                                    }`}
                                    title="Extract to Standalone Row"
                                  >
                                    <Rows size={11} />
                                  </button>
                                </>
                              )}

                              {/* Center on Map */}
                              {item.coordinates && (
                                <button
                                  type="button"
                                  onClick={() => onCenterMap(item.coordinates!)}
                                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-semibold flex items-center gap-0.5 cursor-pointer ${
                                    isDark
                                      ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400'
                                      : 'bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/80 text-[var(--accent-text)] border border-[var(--accent)]/20'
                                  }`}
                                  title="Center on Map"
                                >
                                  <Crosshair size={10} />
                                  <span className="hidden sm:inline">Map</span>
                                </button>
                              )}

                              {/* External Link */}
                              {(item.externalUrl || item.link) && (
                                <a
                                  href={item.externalUrl || item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-1 transition-colors ${
                                    isDark ? 'text-slate-400 hover:text-sky-400' : 'text-[var(--text-secondary)] hover:text-[var(--accent-text)]'
                                  }`}
                                  title="Open External URL"
                                >
                                  <ExternalLink size={11} />
                                </a>
                              )}

                              {/* Quick Toggle: [ ⤢ Full Width / Split ] */}
                              <button
                                type="button"
                                onClick={() => handleToggleCardWidth(row.rowId, col.id)}
                                className={`p-1 rounded transition-colors cursor-pointer ${
                                  isDark
                                    ? 'text-slate-400 hover:text-sky-300 hover:bg-white/5'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-sunken)]'
                                }`}
                                title={colCount > 1 ? "Snap to 100% Full Width Row (⤢)" : "Snap to 50% Split Side-by-Side (◫)"}
                              >
                                {colCount > 1 ? <Maximize2 size={11} /> : <Columns size={11} />}
                              </button>

                              {/* Remove Card */}
                              <button
                                type="button"
                                onClick={() => handleRemoveCard(row.rowId, col.id, item.id)}
                                className={`p-1 rounded transition-colors cursor-pointer ${
                                  isDark
                                    ? 'text-slate-400 hover:text-rose-400'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--sev-critical)] hover:bg-[var(--sev-critical-bg)]'
                                }`}
                                title="Remove from Workspace"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>

                          {/* Card Body with Canva-style custom height */}
                          <div
                            className="p-2.5 flex-1 flex flex-col justify-between overflow-y-auto feed-scrollbar"
                            style={{
                              height: customHeight ? `${customHeight}px` : undefined,
                              minHeight: isVideo ? '200px' : '110px'
                            }}
                          >
                            {/* VIDEO PLAYER ITEM */}
                            {isVideo && (item.youtubeId || item.channelId || item.uploadsPlaylistId) ? (
                              <LiveStreamCard item={item} isLight={!isDark} />
                            ) : (
                              /* INTEL / REPORT ITEM */
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {item.severity && (
                                    <span
                                      className={`px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold uppercase ${
                                        isDark
                                          ? item.severity === 'critical'
                                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                            : item.severity === 'high'
                                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                            : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                                          : item.severity === 'critical'
                                          ? 'bg-[var(--sev-critical-bg)] text-[var(--sev-critical)] border border-[rgba(180,35,24,0.25)]'
                                          : item.severity === 'high'
                                          ? 'bg-[var(--sev-high-bg)] text-[var(--sev-high)] border border-[rgba(181,71,8,0.25)]'
                                          : item.severity === 'medium'
                                          ? 'bg-[var(--sev-medium-bg)] text-[var(--sev-medium)] border border-[rgba(138,97,0,0.25)]'
                                          : 'bg-[var(--sev-info-bg)] text-[var(--sev-info)] border border-[rgba(47,111,143,0.25)]'
                                      }`}
                                    >
                                      {item.severity}
                                    </span>
                                  )}

                                  {item.source && (
                                    <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold ${
                                      isDark
                                        ? 'bg-white/5 text-slate-300 border border-white/10'
                                        : 'bg-[var(--bg-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                                    }`}>
                                      {item.source}
                                    </span>
                                  )}

                                  {item.timestamp && (
                                    <span className={`text-[9.5px] font-mono ml-auto ${
                                      isDark ? 'text-slate-400' : 'text-[var(--text-tertiary)]'
                                    }`}>
                                      {item.timestamp}
                                    </span>
                                  )}
                                </div>

                                <p className={`text-[11.5px] leading-relaxed font-sans ${
                                  isDark ? 'text-slate-300' : 'text-[var(--text-secondary)]'
                                }`}>
                                  {item.summary || item.description || item.subtitle || 'No detailed brief available.'}
                                </p>

                                {item.parties && item.parties.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap pt-1 text-[9.5px] font-mono">
                                    <span className={isDark ? "text-slate-500" : "text-[var(--text-tertiary)]"}>PARTIES:</span>
                                    {item.parties.map((p, pIdx) => (
                                      <span key={pIdx} className={`px-1 rounded ${
                                        isDark
                                          ? 'bg-slate-800 text-slate-200'
                                          : 'bg-[var(--bg-sunken)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                                      }`}>
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Card Footer Quick Presets */}
                            <div className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[9px] font-mono ${
                              isDark ? 'border-white/[0.04] text-slate-500' : 'border-[var(--border-subtle)] text-[var(--text-tertiary)]'
                            }`}>
                              <span className={`text-[8.5px] uppercase ${isDark ? 'text-slate-400' : 'text-[var(--text-tertiary)]'}`}>
                                {customHeight ? `${customHeight}px` : 'AUTO'}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSetPresetHeight(row.rowId, col.id, 140)}
                                  className={`px-1 rounded ${
                                    isDark ? 'hover:bg-white/5 hover:text-sky-300' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sunken)] hover:text-[var(--accent-text)]'
                                  }`}
                                >
                                  SM
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetPresetHeight(row.rowId, col.id, 240)}
                                  className={`px-1 rounded ${
                                    isDark ? 'hover:bg-white/5 hover:text-sky-300' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sunken)] hover:text-[var(--accent-text)]'
                                  }`}
                                >
                                  MD
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetPresetHeight(row.rowId, col.id, 380)}
                                  className={`px-1 rounded ${
                                    isDark ? 'hover:bg-white/5 hover:text-sky-300' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sunken)] hover:text-[var(--accent-text)]'
                                  }`}
                                >
                                  LG
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetPresetHeight(row.rowId, col.id, undefined)}
                                  className={`px-1 rounded ${
                                    isDark ? 'hover:bg-white/5 hover:text-sky-300' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sunken)] hover:text-[var(--accent-text)]'
                                  }`}
                                >
                                  RESET
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Canva-Style Bottom Bar & Corner Resize Gutter (↕ / ↘) */}
                          <div className={`relative h-2.5 w-full border-t flex items-center justify-between select-none shrink-0 group/bottombar rounded-b-xl ${
                            isDark
                              ? 'bg-slate-900/90 border-slate-800/80'
                              : 'bg-[var(--bg-panel)] border-[var(--border-subtle)]'
                          }`}>
                            {/* Bottom Edge ↕ Height Drag Handle */}
                            <div
                              onMouseDown={(e) =>
                                handleStartCardHeightResize(row.rowId, col.id, customHeight, e)
                              }
                              className={`h-full flex-1 cursor-ns-resize flex items-center justify-center group/height transition-colors ${
                                isDark ? 'hover:bg-sky-500/20' : 'hover:bg-[var(--accent-soft)]'
                              }`}
                              title="Drag down/up to resize card height (↕)"
                            >
                              <div className={`h-0.5 rounded-full transition-all ${
                                isDark
                                  ? 'w-12 bg-slate-600 group-hover/height:bg-sky-400 group-hover/height:w-16'
                                  : 'w-12 bg-[var(--border-strong)] group-hover/height:bg-[var(--accent)] group-hover/height:w-16'
                              }`} />
                            </div>

                            {/* Bottom-Right Corner ↘ Height + Width Drag Handle */}
                            <div
                              onMouseDown={(e) =>
                                handleStartCardCornerResize(row.rowId, col.id, colIdx, customHeight, e)
                              }
                              className={`h-full w-5 hover:w-6 cursor-nwse-resize flex items-center justify-center transition-all border-l group/corner ${
                                isDark
                                  ? 'hover:bg-sky-500/30 text-slate-500 hover:text-sky-300 border-white/[0.04]'
                                  : 'hover:bg-[var(--accent-soft)] text-[var(--text-tertiary)] hover:text-[var(--accent-text)] border-[var(--border-subtle)]'
                              }`}
                              title="Drag corner to resize taller & wider (↘)"
                            >
                              <svg className="w-2.5 h-2.5 opacity-60 group-hover/corner:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="none">
                                <path d="M8 2L2 8M9 5L5 9M9 8L8 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Inter-Row Drop Slot (Between Row rowIdx and rowIdx + 1) */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = 'copy';
                  if (activeDropTarget?.type !== 'row_slot' || activeDropTarget.targetRowIndex !== rowIdx + 1) {
                    setActiveDropTarget({ type: 'row_slot', targetRowIndex: rowIdx + 1 });
                  }
                }}
                onDragLeave={(e) => {
                  const nextNode = e.relatedTarget as Node | null;
                  if (!e.currentTarget.contains(nextNode)) {
                    if (activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === rowIdx + 1) {
                      setActiveDropTarget(null);
                    }
                  }
                }}
                onDrop={(e) => handleRowSlotDrop(e, rowIdx + 1)}
                className="relative py-2.5 -my-1 z-30 cursor-pointer group"
              >
                <div
                  className={`h-[3px] rounded-full transition-all flex items-center justify-center relative ${
                    isDark
                      ? activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === rowIdx + 1
                        ? 'bg-[#38BDF8] shadow-[0_0_14px_#38BDF8] opacity-100 scale-y-125'
                        : 'bg-transparent opacity-0 group-hover:bg-sky-400/25 group-hover:opacity-60'
                      : activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === rowIdx + 1
                        ? 'bg-[var(--accent)] shadow-[0_0_10px_rgba(198,97,63,0.35)] opacity-100 scale-y-125'
                        : 'bg-transparent opacity-0 group-hover:bg-[var(--accent)]/25 group-hover:opacity-60'
                  }`}
                >
                  {activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === rowIdx + 1 && (
                    <span className={`absolute -top-3.5 px-3 py-0.5 rounded-full text-white text-[9.5px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 z-50 pointer-events-none whitespace-nowrap ${
                      isDark ? 'bg-[#0284C7]' : 'bg-[var(--accent)]'
                    }`}>
                      + INSERT NEW ROW HERE (BETWEEN ROW {rowIdx + 1} & {rowIdx + 2})
                    </span>
                  )}
                </div>
              </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Bottom Canvas Append Drop Zone (when rows exist) */}
      {localRows.length > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            if (activeDropTarget?.type !== 'row_slot' || activeDropTarget.targetRowIndex !== localRows.length) {
              setActiveDropTarget({ type: 'row_slot', targetRowIndex: localRows.length });
            }
          }}
          onDragLeave={(e) => {
            const nextNode = e.relatedTarget as Node | null;
            if (!e.currentTarget.contains(nextNode)) {
              if (activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === localRows.length) {
                setActiveDropTarget(null);
              }
            }
          }}
          onDrop={(e) => handleRowSlotDrop(e, localRows.length)}
          className={`min-h-[72px] mt-2 mb-6 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer ${
            isDark
              ? activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === localRows.length
                ? 'border-[#38BDF8] bg-sky-500/10 text-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                : 'border-slate-800/80 hover:border-slate-700 bg-[#090d16]/30 text-slate-500 hover:text-slate-400'
              : activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === localRows.length
                ? 'border-[var(--accent)] bg-[var(--accent-soft)]/50 text-[var(--accent-text)] shadow-md'
                : 'border-[var(--border-subtle)] hover:border-[var(--accent)]/40 bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent-text)] shadow-[var(--shadow-sm)]'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider">
            <Plus size={12} className={
              activeDropTarget?.type === 'row_slot' && activeDropTarget.targetRowIndex === localRows.length
                ? isDark ? 'text-[#38BDF8] animate-bounce' : 'text-[var(--accent)] animate-bounce'
                : isDark ? 'text-sky-400' : 'text-[var(--accent)]'
            } />
            <span>Drop here to append as new row at bottom</span>
          </div>
          <span className={`text-[9px] mt-0.5 font-mono ${isDark ? 'text-slate-600' : 'text-[var(--text-tertiary)]'}`}>
            Hover card edges for 4-directional placement (↑ Top, ↓ Bottom, ← Left, → Right)
          </span>
        </div>
      )}
    </div>

      {/* 5. Footer Information */}
      <div
        className="h-7 px-3 flex items-center justify-between shrink-0 border-t text-[9px] font-mono"
        style={{
          background: isDark ? 'rgba(6, 9, 15, 0.95)' : 'var(--bg-panel)',
          borderColor: 'var(--border-subtle)',
          color: isDark ? '#64748B' : 'var(--text-tertiary)'
        }}
      >
        <div className={`flex items-center gap-2 ${isDark ? 'text-sky-400' : 'text-[var(--accent-text)] font-semibold'}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-emerald-400' : 'bg-[var(--sev-ok)]'}`} />
          <span>NOTION 2D BLOCK ENGINE</span>
        </div>
        <span>DRAG EDGES (↔ ↕) TO RESIZE</span>
      </div>
    </div>
  );
};
