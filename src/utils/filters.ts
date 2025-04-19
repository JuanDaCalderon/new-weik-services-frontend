import {Employee} from '@/types';

/**
 * Filtra una lista de empleados por texto de búsqueda.
 * Busca en: nombres, apellidos, email y userName.
 */
export function filterUsers(users: Employee[], text: string): Employee[] {
  if (!text) return [...users];

  const searchTerm = text.toLowerCase();

  return users.filter((u) =>
    ['nombres', 'email', 'apellidos', 'userName'].some((key) =>
      (u[key as keyof Employee] || '').toString().toLowerCase().includes(searchTerm)
    )
  );
}
