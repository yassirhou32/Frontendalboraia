'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { premiumInputClass } from '@/components/admin/y2k';

export type DropdownOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: string[] | DropdownOption[];
  placeholder?: string;
};

function normalizeOptions(options: string[] | DropdownOption[]): DropdownOption[] {
  if (options.length === 0) return [];
  if (typeof options[0] === 'string') {
    return (options as string[]).map((o) => ({ value: o, label: o }));
  }
  return options as DropdownOption[];
}

export default function ServiceDropdown({
  value,
  onChange,
  options,
  placeholder = '— Selecciona una opción —',
}: Props) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const items = normalizeOptions(options);
  const selected = items.find((o) => o.value === value);

  const updatePosition = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleReposition = () => updatePosition();
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  const menu = open && (
    <div
      ref={menuRef}
      className="fixed z-[9999] rounded-xl border border-white/10 bg-[#14141a] shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
      style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
    >
      {items.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => { onChange(opt.value); setOpen(false); }}
          className={cn(
            'w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-base transition-colors cursor-pointer border-b border-white/[0.05] last:border-b-0',
            value === opt.value
              ? 'bg-white/[0.08] text-white font-semibold'
              : 'text-neutral-300 hover:bg-white/[0.05] hover:text-white'
          )}
        >
          <span>{opt.label}</span>
          {value === opt.value && <Check className="w-5 h-5 text-white shrink-0" />}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          premiumInputClass,
          'flex items-center justify-between gap-3 text-left cursor-pointer',
          open && 'border-white/25 bg-white/[0.06]'
        )}
      >
        <span className={cn('text-base', value ? 'text-white font-medium' : 'text-neutral-500')}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={cn('w-5 h-5 text-neutral-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {typeof document !== 'undefined' && menu && createPortal(menu, document.body)}
    </div>
  );
}
