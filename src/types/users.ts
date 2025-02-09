import {ESTADOS} from '@/constants';
import {Permiso, Rol} from '@/types';
import {Timestamp} from 'firebase/firestore';

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

export type HorasTrabajoType = {
  isInWorkingTime: boolean; // BOOLEAN
  checkIn: string; // TIMESTAMP
  hasCheckIn: boolean; // BOOLEAN
  checkOut: string | null; // TIMESTAMP
  hasCheckOut: boolean; // BOOLEAN
  dia: string; // STRING
  tiempoDeTrabajoEnSegundos: number; //El total de horas en segundos // NUMBER
  horasDeTrabajo: number; // 1-24 // NUMBER
  minutosDeTrabajo: number; // 1-60 // NUMBER
  tiempoDeTrabajoExtraEnSegundos: number; //El total de horas en segundos pero de las horas extra // NUMBER
  horasDeTrabajoExtra: number; // 1-24 de horas extra // NUMBER
  minutosDeTrabajoExtra: number; // 1-60 de horas extra // NUMBER
};

export type HorasTrabajoToFirestore = {
  isInWorkingTime: boolean;
  checkIn: Timestamp;
  hasCheckIn: boolean;
  checkOut: Timestamp | null;
  hasCheckOut: boolean;
  dia: string;
  tiempoDeTrabajoEnSegundos: number;
  horasDeTrabajo: number; // 1-24
  minutosDeTrabajo: number; // 1-60
  tiempoDeTrabajoExtraEnSegundos: number;
  horasDeTrabajoExtra: number; // 1-24
  minutosDeTrabajoExtra: number; // 1-60
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
  fechaCreacion: string;
  numeroDocumento: string;
  ciudadExpedicionDocumento: string;
  estado: Estados;
  cargo: string;
  roles: RolesForUser[];
  permisosOtorgados: Permiso[];
  permisosDenegados: Permiso[];
  horario: HorarioType[];
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
  isLoading: boolean;
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
