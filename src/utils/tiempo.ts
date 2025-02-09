import {HorasTrabajoType} from '@/types';

export const calcularHorasTrabajo = (
  checkIn: Date,
  checkOut: Date
): Omit<
  HorasTrabajoType,
  'isInWorkingTime' | 'checkIn' | 'hasCheckIn' | 'checkOut' | 'hasCheckOut' | 'dia'
> => {
  const segundosTotales = Math.floor((checkOut.getTime() - checkIn.getTime()) / 1000); // Diferencia en segundos
  const maxTiempoRegular = 9 * 3600; // 9 horas en segundos

  // Tiempo regular (máximo 9 horas)
  const tiempoRegular = Math.min(segundosTotales, maxTiempoRegular);
  const horasDeTrabajo = Math.floor(tiempoRegular / 3600);
  const minutosDeTrabajo = Math.floor((tiempoRegular % 3600) / 60);

  // Tiempo extra (si hay más de 9 horas)
  const tiempoExtra = Math.max(0, segundosTotales - maxTiempoRegular);
  const horasDeTrabajoExtra = Math.floor(tiempoExtra / 3600);
  const minutosDeTrabajoExtra = Math.floor((tiempoExtra % 3600) / 60);

  return {
    tiempoDeTrabajoEnSegundos: tiempoRegular,
    tiempoDeTrabajoExtraEnSegundos: tiempoExtra,
    horasDeTrabajo,
    minutosDeTrabajo,
    horasDeTrabajoExtra,
    minutosDeTrabajoExtra
  };
};
