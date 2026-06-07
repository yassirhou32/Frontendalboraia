import { Wrench } from 'lucide-react';
import Link from 'next/link';

export default function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 group">
      <div className="relative">
        <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full group-hover:bg-accent/40 transition-all" />
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-700 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <span className="text-xl font-bold tracking-tight">Alboraia</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted -mt-0.5">Garage Premium</span>
      </div>
    </Link>
  );
}
