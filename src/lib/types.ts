export type RequestStatus = 'pendiente' | 'aprobado' | 'rechazado';

export type ServiceRequest = {
  _id: string;
  userId: string;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
  matricule: string;
  marca: string;
  modelo: string;
  kilometraje: number;
  tipoServicio: 'garage' | 'box';
  servicioBox: string;
  fechaEntrada: string;
  horaEntrada: string;
  estado: RequestStatus;
  facturacion: {
    precio: number | null;
    horaSalida: string | null;
  };
  motivoRechazo?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlockedDate = {
  _id: string;
  fecha: string;
  tipo: 'dia_completo' | 'hora_especifica';
  hora?: string | null;
  motivo: string;
};

export type ClientUser = {
  _id: string;
  nombre: string;
  email: string;
  createdAt: string;
  solicitudes: number;
};

export type ClientDetail = {
  user: {
    _id: string;
    nombre: string;
    email: string;
    createdAt: string;
  };
  solicitudes: ServiceRequest[];
};

export type DashboardStats = {
  total: number;
  pendientes: number;
  aprobados: number;
  rechazados: number;
};

export const SERVICIOS_BOX = [
  'MANTENIMIENTO MOTOR',
  'PRE-ITV',
  'CAMBIO NEUMÁTICOS',
  'CAMBIO DE ACEITE',
  'REPARACIÓN AIRE ACONDICIONADO',
  'SERVICIO DE FRENOS',
  'CARAUDIO',
  'REVISIÓN ELÉCTRICA',
];

export type SlotAvailability = {
  approved: number;
  available: number;
  full: boolean;
};

export type AvailabilityResponse = {
  maxBoxes: number;
  fecha: string;
  servicioBox: string;
  slots: Record<string, SlotAvailability>;
};

export const HORAS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];
