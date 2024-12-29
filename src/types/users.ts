import {ESTADOS} from '@/constants';
import {Permiso, Rol} from './roles-permisos';

export type Estados = ESTADOS.online | ESTADOS.offline | ESTADOS.inactivo;

export type UserWorkData = {
  diaInicio: string;
  mesInicio: string;
  anioInicio: string;
  salarioNumero: number;
  salarioTexto: string;
  salarioExtraNumero: number;
  salarioExtraTexto: string;
};

export type HorarioType = {
  rangoFechas: string[];
  horaInicio: string;
  horasDeTrabajo: number;
  break: string;
};

export type HorasExtraType = {
  checkInExtra: string;
  checkOutExtra: string;
  dia: string;
  horasDeTrabajoExtra: number;
  horasDeTrabajoExtraEnSegundos: number;
};

export type HorasTrabajoType = {
  checkIn: string;
  checkOut: string;
  dia: string;
  horasDeTrabajo: number;
  horasDeTrabajoEnSegundos: number;
};

export type VacacionesType = {
  rangoFechas: string[];
  aprobadas: boolean;
};

export type RolesForUser = Omit<
  Rol,
  'descripcion' | 'usuarioCreacion' | 'fechaCreacion' | 'fechaActualizacion' | 'usuarioUpdated'
>;

export type Employee = {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  userName: string;
  userImage: string;
  fechaNacimiento: string;
  numeroDocumento: string;
  ciudadExpedicionDocumento: string;
  estado: Estados;
  cargo: string;
  roles: RolesForUser[];
  permisosOtorgados: Permiso[];
  permisosDenegados: Permiso[];
  horario: HorarioType[];
  horasExtra: HorasExtraType[];
  horasTrabajo: HorasTrabajoType[];
  vacaciones: VacacionesType[];
  informacionLaboral: UserWorkData;
};

export type PartialEmployee = Partial<Employee>;

export interface User extends Employee {
  uid: string;
  token: string;
}

export type PayLoadUserType = {
  user: User;
  domain: string;
  isLoggedIn: boolean;
  rememberme: boolean;
};

export type PayLoadUsers = {
  users: Employee[];
  isLoadingUsers: boolean;
};

/* -------- Utils -------- */

export type thisUsuarios = {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  userName: string;
  userImage: string;
  cargo: string;
  roles: RolesForUser[];
  permisosOtorgados: Permiso[];
  permisosDenegados: Permiso[];
};

export type UsuarioCargoEdit = {
  cargo?: string;
};
