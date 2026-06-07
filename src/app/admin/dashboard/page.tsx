'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid,
} from 'recharts';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChromeCard, buildTelemetryData, PageIntro } from '@/components/admin/y2k';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { getAdminToken } from '@/lib/auth';
import type { DashboardStats } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    api<DashboardStats>('/requests/admin/stats/dashboard', { token: getAdminToken() })
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) return null;

  const telemetry = buildTelemetryData(stats);
  const chartData = telemetry[chartPeriod];
  const radarData = telemetry.radar;
  const approvalRate = stats.total > 0 ? ((stats.aprobados / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8">
      <PageIntro title="Resumen del garage" description="Vista general de solicitudes, rendimiento y actividad reciente." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ChromeCard className="md:col-span-2" title="Tasa de aprobación" subtitle="Rendimiento del garage" hideMenu>
        <div className="flex items-end gap-4">
          <p className="stat-number text-white">
            {approvalRate}<span className="text-3xl text-neutral-500 font-bold">%</span>
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-2">
            <Zap className="w-4 h-4" />
            Aprobación
          </div>
        </div>
      </ChromeCard>

      {[
        { label: 'Total solicitudes', val: String(stats.total), trend: `${stats.pendientes} pendientes` },
        { label: 'Pendientes', val: String(stats.pendientes), trend: stats.pendientes > 0 ? 'Requiere acción' : 'Al día' },
      ].map((stat, i) => (
        <ChromeCard key={i} title={stat.label} subtitle={stat.trend} hideMenu>
          <p className="stat-number text-white mt-2">{stat.val}</p>
        </ChromeCard>
      ))}

      <ChromeCard className="md:col-span-2 lg:col-span-3 min-h-[400px]" title="Telemetría del Sistema" subtitle="Solicitudes del Garage">
        <div className="absolute top-6 right-6 flex gap-2">
          {(['daily', 'monthly', 'yearly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setChartPeriod(period)}
              className={cn(
                'px-4 py-2 text-sm font-semibold border border-white/10 rounded-lg transition-colors',
                chartPeriod === period ? 'bg-gradient-to-r from-[#F5D76E] to-[#D4AF37] text-black font-bold border-[#D4AF37]/40' : 'hover:bg-[#D4AF37]/10 hover:text-[#F5D76E]'
              )}
            >
              {period === 'daily' ? 'diario' : period === 'monthly' ? 'mensual' : 'anual'}
            </button>
          ))}
        </div>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#525252"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 12, fill: '#737373' }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontFamily: 'JetBrains Mono' }}
              />
              <Area
                key={`speed-${chartPeriod}`}
                type="monotone"
                dataKey="speed"
                stroke="#D4AF37"
                strokeWidth={2}
                fill="url(#colorSpeed)"
                fillOpacity={1}
                animationDuration={1000}
              />
              <Area
                key={`stab-${chartPeriod}`}
                type="monotone"
                dataKey="stability"
                stroke="#F5D76E"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray="5 5"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChromeCard>

      <ChromeCard title="Análisis" subtitle="Estado de Solicitudes" className="flex flex-col items-center justify-center">
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <PolarRadiusAxis angle={30} domain={[0, Math.max(stats.total, 1)]} tick={false} axisLine={false} />
              <Radar name="Sistema" dataKey="A" stroke="#D4AF37" strokeWidth={2} fill="#D4AF37" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full" /> Actual
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <div className="w-2 h-2 bg-green-500 rounded-full" /> {stats.aprobados} aprobadas
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <div className="w-2 h-2 bg-red-500 rounded-full" /> {stats.rechazados} rechazadas
          </div>
        </div>
      </ChromeCard>
      </div>
    </div>
  );
}
