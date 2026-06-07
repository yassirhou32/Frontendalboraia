'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, Send, Gauge } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ServiceDropdown from '@/components/ServiceDropdown';
import DatePicker from '@/components/DatePicker';
import { ChromeCard, PremiumButton, clientInputClass, clientLabelClass, PageIntro } from '@/components/admin/y2k';
import StatusFrame from '@/components/StatusFrame';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { getClientToken, getClientUser } from '@/lib/auth';
import { SERVICIOS_BOX, HORAS } from '@/lib/types';
import type { AvailabilityResponse, BlockedDate } from '@/lib/types';

export default function ClientDashboardPage() {
  const router = useRouter();
  const [allBlocked, setAllBlocked] = useState<BlockedDate[]>([]);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    matricule: '',
    marca: '',
    modelo: '',
    kilometraje: '',
    tipoServicio: '' as '' | 'garage' | 'box',
    servicioBox: '',
    fechaEntrada: '',
    horaEntrada: '',
  });

  useEffect(() => {
    if (!getClientToken()) {
      router.push('/acceso');
      return;
    }
    const user = getClientUser();
    if (user) {
      setForm((prev) => ({ ...prev, nombre: user.nombre }));
    }
    api<BlockedDate[]>('/calendar/blocked')
      .then(setAllBlocked)
      .catch(() => {});
  }, [router]);

  const blockedDates = allBlocked
    .filter((b) => b.tipo === 'dia_completo')
    .map((b) => b.fecha.split('T')[0]);

  const blockedHours = form.fechaEntrada
    ? allBlocked
        .filter((b) => b.tipo === 'hora_especifica' && b.fecha.split('T')[0] === form.fechaEntrada && b.hora)
        .map((b) => b.hora as string)
    : [];

  useEffect(() => {
    if (!form.servicioBox || !form.fechaEntrada) {
      setAvailability(null);
      return;
    }
    api<AvailabilityResponse>(
      `/requests/availability?fecha=${form.fechaEntrada}&servicioBox=${encodeURIComponent(form.servicioBox)}`
    )
      .then(setAvailability)
      .catch(() => setAvailability(null));
  }, [form.servicioBox, form.fechaEntrada]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.tipoServicio) {
      setError('Debe seleccionar un tipo de servicio');
      return;
    }
    if (!form.servicioBox) {
      setError('Debe seleccionar un servicio');
      return;
    }
    if (!form.fechaEntrada) {
      setError('Debe seleccionar una fecha de entrada');
      return;
    }
    if (blockedDates.includes(form.fechaEntrada)) {
      setError('Esta fecha no está disponible');
      return;
    }
    if (!form.horaEntrada) {
      setError('Debe seleccionar una hora de entrada');
      return;
    }
    if (blockedHours.includes(form.horaEntrada)) {
      setError('Esta hora no está disponible');
      return;
    }
    if (availability?.slots[form.horaEntrada]?.full) {
      setError('No hay boxes disponibles en esta hora (6/6 ocupados)');
      return;
    }

    setLoading(true);

    try {
      await api('/requests', {
        method: 'POST',
        token: getClientToken(),
        body: {
          ...form,
          kilometraje: Number(form.kilometraje),
          servicioBox: form.servicioBox,
        },
      });
      setSuccess('¡Solicitud enviada con éxito! Puedes seguir su estado en "Mis Solicitudes".');
      setForm((prev) => ({
        ...prev,
        direccion: '', telefono: '', matricule: '', marca: '', modelo: '',
        kilometraje: '', tipoServicio: '', servicioBox: '', fechaEntrada: '', horaEntrada: '',
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageIntro
        title="Nueva solicitud"
        description="Reserva tu cita en el garage. Completa el formulario y elige fecha y hora."
      />
      <StatusFrame
        mode="toast"
        variant="enviado"
        visible={!!success}
        message={success}
        subtitle="Transmisión completada"
        onDismiss={() => setSuccess('')}
      />
      <StatusFrame
        mode="toast"
        variant="error"
        visible={!!error}
        message={error}
        subtitle="Error en el envío"
        onDismiss={() => setError('')}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ChromeCard title="Datos Personales" subtitle="Información de contacto">
          <div className="grid sm:grid-cols-2 gap-5 mt-2">
            <div>
              <label className={clientLabelClass}>Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className={clientInputClass}
                required
              />
            </div>
            <div>
              <label className={clientLabelClass}>Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className={cn(clientInputClass, 'pl-10')}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={clientLabelClass}>Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  className={cn(clientInputClass, 'pl-10')}
                  required
                />
              </div>
            </div>
          </div>
        </ChromeCard>

        <ChromeCard title="Datos del Vehículo" subtitle="Matrícula y modelo">
          <div className="grid sm:grid-cols-2 gap-5 mt-2">
            <div>
              <label className={clientLabelClass}>Matrícula</label>
              <input
                type="text"
                value={form.matricule}
                onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                className={clientInputClass}
                placeholder="1234 ABC"
                required
              />
            </div>
            <div>
              <label className={clientLabelClass}>Kilometraje</label>
              <div className="relative">
                <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="number"
                  value={form.kilometraje}
                  onChange={(e) => setForm({ ...form, kilometraje: e.target.value })}
                  className={cn(clientInputClass, 'pl-10')}
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className={clientLabelClass}>Marca</label>
              <input
                type="text"
                value={form.marca}
                onChange={(e) => setForm({ ...form, marca: e.target.value })}
                className={clientInputClass}
                required
              />
            </div>
            <div>
              <label className={clientLabelClass}>Modelo</label>
              <input
                type="text"
                value={form.modelo}
                onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                className={clientInputClass}
                required
              />
            </div>
          </div>
        </ChromeCard>

        <ChromeCard title="Tipo de Servicio" subtitle="Garage o alquiler de box">
          <div className="space-y-5 mt-2">
            <div>
              <label className={clientLabelClass}>Tipo de Servicio</label>
              <ServiceDropdown
                value={form.tipoServicio}
                onChange={(v) => setForm({ ...form, tipoServicio: v as 'garage' | 'box' })}
                options={[
                  { value: 'garage', label: 'Reparación por nuestro garage' },
                  { value: 'box', label: 'Alquilar box para reparar yo mismo' },
                ]}
                placeholder="— Selecciona el tipo de servicio —"
              />
            </div>
            <div>
              <label className={clientLabelClass}>Seleccionar Servicio</label>
              <ServiceDropdown
                value={form.servicioBox}
                onChange={(s) => setForm({ ...form, servicioBox: s, horaEntrada: '' })}
                options={SERVICIOS_BOX}
                placeholder="— Selecciona un servicio —"
              />
            </div>
          </div>
        </ChromeCard>

        <ChromeCard title="Fecha y Hora" subtitle="Horario 09:00 — 18:00">
          <div className="space-y-5 mt-2">
            <div>
              <label className={clientLabelClass}>Fecha de entrada</label>
              <DatePicker
                value={form.fechaEntrada}
                onChange={(d) => setForm({ ...form, fechaEntrada: d, horaEntrada: '' })}
                minDate={minDate}
                blockedDates={blockedDates}
                placeholder="Selecciona una fecha"
              />
              {form.fechaEntrada && blockedDates.includes(form.fechaEntrada) && (
                <p className="text-xs text-red-400 mt-2 font-mono">Esta fecha no está disponible</p>
              )}
              {form.fechaEntrada && !form.servicioBox && !blockedDates.includes(form.fechaEntrada) && (
                <p className="text-xs text-neutral-500 mt-2 font-mono">
                  Selecciona un servicio arriba para elegir la hora de entrada
                </p>
              )}
            </div>

            {form.fechaEntrada && form.servicioBox && !blockedDates.includes(form.fechaEntrada) && (
              <div className="space-y-4 p-5 rounded-2xl border border-white/22 bg-black/[0.15] backdrop-blur-[6px]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block font-mono text-xs uppercase text-neutral-400">
                    Hora de entrada — haz clic para seleccionar
                  </label>
                  {availability && (
                    <span className="text-xs text-neutral-400 font-mono">
                      Máx. <strong className="text-indigo-400">6 boxes</strong> por hora
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {HORAS.map((h) => {
                    const selected = form.horaEntrada === h;
                    const isAdminBlocked = blockedHours.includes(h);
                    const slot = availability?.slots[h];
                    const isFull = slot?.full ?? false;
                    const disabled = isAdminBlocked || isFull;
                    return (
                      <button
                        key={h}
                        type="button"
                        disabled={disabled}
                        onClick={() => setForm({ ...form, horaEntrada: h })}
                        className={cn(
                          'py-4 px-3 rounded-xl border text-base font-bold transition-all select-none flex flex-col items-center gap-1',
                          disabled
                            ? 'border-red-500/20 bg-red-500/5 text-red-400/50 cursor-not-allowed'
                            : selected
                              ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105 cursor-pointer'
                              : 'border-white/22 bg-black/[0.15] text-zinc-100 hover:border-[#D4AF37]/50 hover:bg-black/25 cursor-pointer backdrop-blur-[6px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]'
                        )}
                      >
                        <span>{h}</span>
                        {slot && !isAdminBlocked && (
                          <span className={cn('text-[10px] font-normal', isFull ? 'text-red-400' : 'text-neutral-500')}>
                            {isFull ? 'Completo' : `${slot.available}/6 libres`}
                          </span>
                        )}
                        {isAdminBlocked && (
                          <span className="text-[10px] font-normal text-red-400/60">Bloqueado</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {form.horaEntrada && availability?.slots[form.horaEntrada] && !availability.slots[form.horaEntrada].full && (
                  <p className="text-sm text-green-400 font-mono">
                    ✓ Hora seleccionada: <strong>{form.horaEntrada}</strong>
                    {' '}({availability.slots[form.horaEntrada].available} boxes disponibles)
                  </p>
                )}
              </div>
            )}
          </div>
        </ChromeCard>

        <PremiumButton
          type="submit"
          disabled={loading || (form.fechaEntrada !== '' && blockedDates.includes(form.fechaEntrada))}
          className="w-full"
        >
          {loading ? <LoadingSpinner size="sm" /> : (
            <>
              <Send className="w-5 h-5" />
              Enviar Solicitud
            </>
          )}
        </PremiumButton>
      </form>
    </div>
  );
}
