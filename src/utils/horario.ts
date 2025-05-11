import {HorasTrabajoType, VacacionesType} from '@/types';
import {DateUtils} from './fechas';

/**
 * A partir del filtro, obtiene el rango `[desde, hasta]`.
 *
 * @param {Date | [Date, Date]} filtro - Fecha única o rango de fechas.
 * @returns {[Date, Date]} - Rango de fechas desde y hasta.
 */
function obtenerRangoDesdeFiltro(filtro: Date | [Date, Date]): [Date, Date] {
  if (Array.isArray(filtro)) return filtro;
  const desde = new Date(filtro.getFullYear(), filtro.getMonth(), 1);
  const hasta = new Date(filtro.getFullYear(), filtro.getMonth() + 1, 0);
  return [desde, hasta];
}

/**
 * Calcula el total de horas normales trabajadas en un mes o rango de fechas.
 *
 * @param {Horario[]} horarios - Arreglo de registros de horario.
 * @param {Date | [Date, Date]} filtro - Un `Date` para un mes completo o `[Date, Date]` para un rango de fechas.
 * @returns {number} - Total de horas normales trabajadas.
 */
export function calcularHorasTrabajadas(
  horarios: HorasTrabajoType[],
  filtro: Date | [Date, Date]
): {horas: number; minutos: number} {
  const [desde, hasta] = obtenerRangoDesdeFiltro(filtro);

  const resultado = horarios.reduce(
    (total, horario) => {
      const fechaHorario = DateUtils.parseLocaleDateString(horario.dia);
      if (fechaHorario >= desde && fechaHorario <= hasta) {
        total.horas += horario.horasDeTrabajo;
        total.minutos += horario.minutosDeTrabajo;
      }
      return total;
    },
    {
      horas: 0,
      minutos: 0
    }
  );

  if (resultado.minutos >= 60) {
    const horasDeMas = Math.floor(resultado.minutos / 60);
    resultado.horas += horasDeMas;
    resultado.minutos = resultado.minutos % 60;
  }

  return resultado;
}

/**
 * Calcula el total de horas extra trabajadas en un mes o rango de fechas.
 *
 * @param {Horario[]} horarios - Arreglo de registros de horario.
 * @param {Date | [Date, Date]} filtro - Un `Date` para un mes completo o `[Date, Date]` para un rango de fechas.
 * @returns {number} - Total de horas extra trabajadas.
 */
export function calcularHorasExtras(
  horarios: HorasTrabajoType[],
  filtro: Date | [Date, Date]
): {horas: number; minutos: number} {
  const [desde, hasta] = obtenerRangoDesdeFiltro(filtro);

  const resultado = horarios.reduce(
    (total, horario) => {
      const fechaHorario = DateUtils.parseLocaleDateString(horario.dia);
      if (fechaHorario >= desde && fechaHorario <= hasta) {
        total.horas += horario.horasDeTrabajoExtra;
        total.minutos += horario.minutosDeTrabajoExtra;
      }
      return total;
    },
    {
      horas: 0,
      minutos: 0
    }
  );

  if (resultado.minutos >= 60) {
    const horasDeMas = Math.floor(resultado.minutos / 60);
    resultado.horas += horasDeMas;
    resultado.minutos = resultado.minutos % 60;
  }

  return resultado;
}

/**
 * Obtiene los días de vacaciones aprobadas que caen dentro de un mes o rango específico.
 *
 * @param {VacacionesType[]} vacaciones - Arreglo de vacaciones, cada una con un rango de fechas y estado.
 * @param {Date | [Date, Date]} filtro - Fecha del mes objetivo o un rango de fechas [desde, hasta].
 * @returns {string[]} - Arreglo de días en formato "d/m/yyyy" que son vacaciones aprobadas y están dentro del filtro.
 */
export function obtenerDiasVacaciones(vacaciones: VacacionesType[], filtro: Date | [Date, Date]): string[] {
  const [desde, hasta] = obtenerRangoDesdeFiltro(filtro);
  const diasDeVacaciones: string[] = [];
  vacaciones
    .filter((v) => v.aprobadas === true && Array.isArray(v.rangoFechas) && v.rangoFechas.length === 2)
    .forEach((v) => {
      const inicio = new Date(v.rangoFechas[0]);
      const fin = new Date(v.rangoFechas[1]);
      let actual = new Date(inicio);
      while (actual <= fin) {
        if (actual >= desde && actual <= hasta) {
          const dia = actual.getDate();
          const mes = actual.getMonth() + 1;
          const anio = actual.getFullYear();
          diasDeVacaciones.push(`${dia}/${mes}/${anio}`);
        }
        actual.setDate(actual.getDate() + 1);
      }
    });

  return diasDeVacaciones;
}

/**
 * Filtra el arreglo de horarios para devolver solo los que están dentro del mes o rango dado.
 *
 * @param {HorasTrabajoType[]} horarios - Arreglo completo de registros de horas trabajadas.
 * @param {Date | [Date, Date]} filtro - Un mes (Date) o un rango [desde, hasta].
 * @returns {HorasTrabajoType[]} - Horarios filtrados por fecha.
 */
export function filtrarHorariosPorFecha(horarios: HorasTrabajoType[], filtro: Date | [Date, Date]): HorasTrabajoType[] {
  const [desde, hasta] = obtenerRangoDesdeFiltro(filtro);
  return horarios.filter((horario) => {
    const fechaHorario = DateUtils.parseLocaleDateString(horario.dia);
    return fechaHorario >= desde && fechaHorario <= hasta;
  });
}
