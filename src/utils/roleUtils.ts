import { UserRole } from '../types/auth';

export const getDashboardPath = (role: UserRole): string => {
  if (role.startsWith('enseignant')) return '/dashboard/enseignant';
  if (role.startsWith('responsable')) return '/dashboard/responsable';
  if (role === 'charge_pedagogique') return '/dashboard/pedagogique';
  return `/dashboard/${role}`;
};
