import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Globe,
  Flame,
  Shield,
  Layers,
  Sun,
  Moon,
  ChevronRight,
  Crosshair,
  MapPin,
  ExternalLink,
  Command,
  X
} from 'lucide-react';
import { TheaterView, ThemeMode, LayerKey } from '../types';
import { COUNTRY_INTEL_DATABASE, CountryIntelDetails } from '../data/countryIntel';
import { INTEL_HOTSPOTS } from '../data/hotspots';
import { CONFLICT_ZONES } from '../data/conflicts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (code: string, name: string) => void;
  onSelectView: (view: TheaterView) => void;
  onCenterMap: (coords: [number, number], zoom?: number) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleLayer: (layer: LayerKey) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Country' | 'Conflict' | 'Hotspot' | 'Action' | 'Theater';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCountry,
  onSelectView,
  onCenterMap,
  theme,
  onToggleTheme,
  onToggleLayer
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items
  const items: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [];

    // Theaters (Continents with Asia on top + Antarctica)
    const theaters: { id: TheaterView; name: string }[] = [
      { id: 'global', name: 'Global Command View' },
      { id: 'asia', name: 'Asia Continental Theater' },
      { id: 'africa', name: 'Africa Continental Theater' },
      { id: 'europe', name: 'Europe Continental Theater' },
      { id: 'north-america', name: 'North America Continental Theater' },
      { id: 'south-america', name: 'South America Continental Theater' },
      { id: 'oceania', name: 'Oceania Continental Theater' },
      { id: 'antarctica', name: 'Antarctica Polar Theater' }
    ];

    theaters.forEach((th) => {
      list.push({
        id: `theater_${th.id}`,
        title: th.name,
        subtitle: 'Theater Preset Camera',
        category: 'Theater',
        icon: <Globe size={15} className="text-sky-400" />,
        action: () => {
          onSelectView(th.id);
          onClose();
        }
      });
    });

    // Quick Actions
    list.push({
      id: 'action_theme',
      title: `Toggle to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: `Currently in ${theme.toUpperCase()} command theme`,
      category: 'Action',
      icon: theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-400" />,
      action: () => {
        onToggleTheme();
        onClose();
      }
    });

    // Countries
    Object.values(COUNTRY_INTEL_DATABASE).forEach((c: CountryIntelDetails) => {
      list.push({
        id: `country_${c.code}`,
        title: `${c.name} (${c.code})`,
        subtitle: `${c.capital} • Instability Index: ${c.ciiScore}/100 (${c.ciiRiskLevel})`,
        category: 'Country',
        icon: <span className="text-base">📍</span>,
        action: () => {
          onSelectCountry(c.code, c.name);
          if (c.bounds) {
            const centerLon = (c.bounds[0] + c.bounds[2]) / 2;
            const centerLat = (c.bounds[1] + c.bounds[3]) / 2;
            onCenterMap([centerLon, centerLat], 4.5);
          }
          onClose();
        }
      });
    });

    // Conflict Zones
    CONFLICT_ZONES.forEach((cf) => {
      list.push({
        id: `conflict_${cf.id}`,
        title: cf.name,
        subtitle: `Frontline Conflict • ${cf.parties.join(' vs ')}`,
        category: 'Conflict',
        icon: <span className="text-sm">⚔️</span>,
        action: () => {
          onCenterMap(cf.center, 6.0);
          onClose();
        }
      });
    });

    // Hotspots
    INTEL_HOTSPOTS.forEach((hs) => {
      list.push({
        id: `hotspot_${hs.id}`,
        title: hs.name,
        subtitle: `Level ${hs.escalationScore}/5 Flashpoint • ${hs.escalationTrend}`,
        category: 'Hotspot',
        icon: <Flame size={15} className="text-orange-400" />,
        action: () => {
          onCenterMap(hs.coordinates, 6.5);
          onClose();
        }
      });
    });

    return list;
  }, [theme]);

  // Filtered
  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 10);
    }
    const q = query.toLowerCase();
    return items
      .filter((it) => it.title.toLowerCase().includes(q) || it.subtitle.toLowerCase().includes(q) || it.category.toLowerCase().includes(q))
      .slice(0, 15);
  }, [items, query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-accent)] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[var(--text-primary)]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <Search size={18} className="text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type country, conflict, hotspot, or command (e.g. India, Hormuz, Light)..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-[var(--text-muted)] font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded"
            >
              <X size={15} />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] font-mono">
              No matching intelligence entities or commands.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--bg-surface-hover)] border border-[var(--border-accent)] shadow-xs'
                      : 'border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-[var(--text-primary)] truncate font-sans">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate font-sans">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md uppercase font-bold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {item.category}
                    </span>
                    <ChevronRight size={13} className="text-[var(--text-muted)]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Dismiss</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400">
            <Command size={12} />
            <span>Manekshaw Tactical Navigator</span>
          </div>
        </div>
      </div>
    </div>
  );
};
