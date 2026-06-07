import { RequestStatus } from '@/lib/types';

const labels: Record<RequestStatus, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {labels[status]}
    </span>
  );
}
