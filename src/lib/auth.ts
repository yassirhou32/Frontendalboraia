export type UserData = {
  id: string;
  nombre: string;
  email: string;
};

export type AdminData = {
  id: string;
  nombre: string;
  email: string;
};

export const getClientToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('client_token') : null;

export const getClientUser = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('client_user');
  return data ? JSON.parse(data) : null;
};

export const setClientAuth = (token: string, user: UserData) => {
  clearAdminAuth();
  localStorage.setItem('client_token', token);
  localStorage.setItem('client_user', JSON.stringify(user));
};

export const clearClientAuth = () => {
  localStorage.removeItem('client_token');
  localStorage.removeItem('client_user');
};

export const getAdminToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

export const getAdminUser = (): AdminData | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('admin_user');
  return data ? JSON.parse(data) : null;
};

export const setAdminAuth = (token: string, admin: AdminData) => {
  clearClientAuth();
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(admin));
};

export const clearAdminAuth = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};
