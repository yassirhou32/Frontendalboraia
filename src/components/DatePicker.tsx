'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  blockedDates?: string[];
  placeholder?: string;
};

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const VIEWPORT_MARGIN = 12;
const GAP = 8;

type MenuPos = {
  top: number;
  left: number;
  width: number;
};

function computeMenuPosition(
  trigger: DOMRect,
  menuHeight: number,
  menuWidth: number
): MenuPos {
  const spaceBelow = window.innerHeight - trigger.bottom - VIEWPORT_MARGIN;
  const spaceAbove = trigger.top - VIEWPORT_MARGIN;

  let top: number;
  if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
    top = trigger.bottom + GAP;
  } else {
    top = trigger.top - menuHeight - GAP;
  }

  top = Math.max(VIEWPORT_MARGIN, Math.min(top, window.innerHeight - menuHeight - VIEWPORT_MARGIN));

  let left = trigger.left;
  if (left + menuWidth > window.innerWidth - VIEWPORT_MARGIN) {
    left = window.innerWidth - menuWidth - VIEWPORT_MARGIN;
  }
  left = Math.max(VIEWPORT_MARGIN, left);

  return { top, left, width: menuWidth };
}

export default function DatePicker({
  value,
  onChange,
  minDate,
  blockedDates = [],
  placeholder = 'Selecciona una fecha',
}: Props) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPos>({ top: 0, left: 0, width: 320 });
  const [viewDate, setViewDate] = useState(() =>
    value ? parseISO(value) : new Date()
  );
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const min = minDate ? startOfDay(parseISO(minDate)) : startOfDay(new Date());

  useEffect(() => {
    if (value) setViewDate(parseISO(value));
  }, [value]);

  const updatePosition = () => {
    if (!ref.current) return;
    const trigger = ref.current.getBoundingClientRect();
    const menuWidth = Math.max(trigger.width, 320);
    const menuHeight = menuRef.current?.offsetHeight ?? 400;
    setMenuPos(computeMenuPosition(trigger, menuHeight, menuWidth));
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    requestAnimationFrame(updatePosition);
  }, [open, viewDate]);

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

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const isBlocked = (day: Date) =>
    blockedDates.includes(format(day, 'yyyy-MM-dd'));

  const isDisabled = (day: Date) =>
    isBefore(startOfDay(day), min) || isBlocked(day);

  const handleSelect = (day: Date) => {
    if (isDisabled(day)) return;
    onChange(format(day, 'yyyy-MM-dd'));
    setOpen(false);
  };

  const selectedDate = value ? parseISO(value) : null;

  const calendar = open && (
    <div
      ref={menuRef}
      className="fixed z-[9999] p-5 rounded-2xl border border-white/10 bg-[#0a0a12]/95 backdrop-blur-2xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.1)] overflow-y-auto"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        width: menuPos.width,
        maxHeight: `calc(100vh - ${VIEWPORT_MARGIN * 2}px)`,
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-300 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold text-white capitalize">
          {format(viewDate, 'MMMM yyyy', { locale: es })}
        </h3>
        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-300 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-indigo-400/80 py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewDate);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const today = isToday(day);
          const disabled = isDisabled(day);
          const blocked = isBlocked(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={`
                relative aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all
                ${!inMonth ? 'text-zinc-600' : ''}
                ${disabled
                  ? blocked
                    ? 'text-red-400/40 line-through cursor-not-allowed bg-red-500/5'
                    : 'text-zinc-600 cursor-not-allowed opacity-40'
                  : 'cursor-pointer hover:scale-105 active:scale-95'
                }
                ${selected
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-105'
                  : inMonth && !disabled
                    ? 'text-zinc-200 hover:bg-indigo-500/15 hover:text-indigo-300 border border-transparent hover:border-indigo-500/30'
                    : ''
                }
                ${today && !selected ? 'ring-2 ring-indigo-500/50 ring-offset-1 ring-offset-[#0a0a12]' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-white/5 text-xs text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500" />
          Seleccionado
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full ring-2 ring-indigo-500/50" />
          Hoy
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-500/20 line-through text-red-400 text-[8px] flex items-center justify-center">×</span>
          No disponible
        </span>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl border text-left text-base transition-all duration-200 cursor-pointer ${
          open || value
            ? 'border-white/25 bg-white/[0.06] text-white'
            : 'border-white/[0.1] bg-white/[0.04] text-neutral-400 hover:border-white/20 hover:bg-white/[0.06]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className={value ? 'text-white' : 'text-zinc-400'}>
            {value
              ? format(parseISO(value), "EEEE, d 'de' MMMM yyyy", { locale: es })
              : placeholder}
          </span>
        </div>
        <ChevronLeft
          className={`w-4 h-4 text-indigo-400 transition-transform duration-300 ${open ? '-rotate-90' : 'rotate-180'}`}
        />
      </button>

      {typeof document !== 'undefined' && calendar && createPortal(calendar, document.body)}
    </div>
  );
}
