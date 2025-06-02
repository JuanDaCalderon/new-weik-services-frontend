const START_HOUR = 6;
const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];
class DateUtils {
  /**
   * Convierte un Date a formato 'YYYY/MM/DD, HH:MM:SS GMT-Z'
   * @param date fecha
   * @returns Un string de la fecha con formato 'YYYY/MM/DD, HH:MM:SS GMT-Z'
   */
  static formatDateToString(date: Date): string {
    return date
      .toLocaleString('en-GB', {
        year: 'numeric', // Año completo
        month: '2-digit', // Mes con 2 dígitos
        day: '2-digit', // Día con 2 dígitos
        hour: '2-digit', // Hora con 2 dígitos
        minute: '2-digit', // Minutos con 2 dígitos
        second: '2-digit', // Segundos con 2 dígitos
        hour12: false, // Formato de 24 horas (sin AM/PM)
        timeZoneName: 'short'
      })
      .replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3/$2/$1, $4:$5:$6');
  }

  /**
   * Convierte un string en formato 'YYYY/MM/DD, HH:MM:SS GMT-Z' a Date
   * @param dateString fecha en formato 'YYYY/MM/DD, HH:MM:SS GMT-Z'
   * @returns Un Date de la fecha
   */
  static parseStringToDate(dateString: string): Date {
    const regex = /^\d{4}\/\d{2}\/\d{2}, \d{2}:\d{2}:\d{2} GMT[+-]\d{1,2}$/;
    if (!regex.test(dateString)) {
      throw new Error('Formato de fecha no válido. El formato correcto es "YYYY/MM/DD, HH:MM:SS GMT-Z"');
    }
    return new Date(dateString);
  }

  // Devuelve solo la fecha en formato 'YYYY/MM/DD' o 'YYYY-MM-DD'
  static getDateOnly(date: Date, separator: string = '/'): string {
    return [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'), // Mes con 2 dígitos
      date.getDate().toString().padStart(2, '0') // Día con 2 dígitos
    ].join(separator);
  }

  // Devuelve solo la hora en formato 'HH:mm:ss' (24 horas) o 'hh:mm:ss AM/PM' (12 horas)
  static getTimeOnly(date: Date, use24HourFormat: boolean = true): string {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    if (use24HourFormat) {
      // Formato 24 horas
      return [
        hours.toString().padStart(2, '0'), // Hora con 2 dígitos
        minutes,
        seconds
      ].join(':');
    } else {
      // Formato 12 horas con AM/PM
      const period = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = (hours % 12 || 12).toString().padStart(2, '0'); // 12 horas con 2 dígitos
      return `${adjustedHours}:${minutes}:${seconds} ${period}`;
    }
  }

  /** Devuelve la fecha en formato largo (en español), con o sin la hora incluida */
  static formatLongDate(date: Date, includeTime: boolean = false): string {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const formattedDate: string = `${dayName}, ${date.getDate()} de ${monthName} de ${date.getFullYear()}`;
    if (includeTime) return `${formattedDate}, ${DateUtils.getTimeOnly(date)}`;
    return formattedDate;
  }

  /**
   * Devuelve el nombre del mes en español a partir de una fecha.
   *
   * @param {Date} fecha - Fecha desde la cual se quiere obtener el mes.
   * @returns {string} - Nombre del mes en español (ej. "Enero").
   */
  static getMonth(fecha: Date): string {
    return monthNames[fecha.getMonth()];
  }

  /** Devuelve la fecha en formato corto (en español), con o sin la hora incluida */
  static formatShortDate(date: Date, includeTime: boolean = false): string {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formattedDate: string = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (includeTime) return `${formattedDate}, ${DateUtils.getTimeOnly(date)}`;
    return formattedDate;
  }
  /** Devuelve true si la fecha es de hoy */
  static isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  /**
   * Suma ó Resta un número específico de días a una fecha dada.
   *
   * @param {Date} date - La fecha base a la que se sumarán o restarán los días.
   * @param {number} days - El número de días a sumar (puede ser negativo para restar).
   * @returns {Date} - Una nueva fecha con los días sumados ó restado.
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date); // Clonar la fecha para no modificar la original
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Verifica si una fecha ha expirado en función de la fecha y hora actual.
   *
   * @param {Date | string} expirationDate - La fecha de expiración a evaluar (puede ser `Date` o `string`).
   * @returns {boolean} - `true` si la fecha ya expiró, `false` si aún no ha expirado.
   */
  static hasExpired(expirationDate: Date | string): boolean {
    const now = new Date(); // Fecha y hora actual
    const expDate = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
    return expDate < now;
  }

  /**
   * Verifica si una fecha de inicio está en el futuro en función de la fecha y hora actual.
   *
   * @param {Date | string} startDate - La fecha de inicio a evaluar (puede ser `Date` o `string`).
   * @returns {boolean} - `true` si la fecha está en el futuro (el evento aún no ha iniciado), `false` en caso contrario.
   */
  static isUpcoming(startDate: Date | string): boolean {
    const now = new Date(); // Fecha y hora actual
    const sDate = typeof startDate === 'string' ? new Date(startDate) : startDate;
    return sDate > now;
  }

  /**
   * Convierte una hora en formato militar (24 horas) a formato de 12 horas con AM/PM.
   * @param time Hora en formato militar (ejemplo: "13:30", "01:45", "2:45").
   * @returns Hora en formato de 12 horas con AM/PM (ejemplo: "1:30 PM").
   */
  static convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error('Formato de hora no válido. Debe ser "HH:mm" en formato militar.');
    }
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convierte 0 a 12 para el formato de 12 horas
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  /**
   * Devuelve una fecha con una hora específica, ya sea como objeto Date o como string formateado en formato HH:MM (24 horas).
   *
   * @param {boolean} [asDate=true] - Si es `true`, retorna un objeto `Date`. Si es `false`, retorna una cadena formateada como "HH:MM".
   * @param {Date} [date=new Date()] - Fecha base sobre la que se aplicará la hora deseada. Por defecto se usa la fecha actual.
   * @param {number} [hour=6] - Hora que se establecerá en la fecha (0 a 23).
   * @param {number} [minute=0] - Minutos que se establecerán en la fecha (0 a 59).
   * @returns {Date | string} La fecha con la hora establecida, como objeto Date o string formateado, según `asDate`.
   *
   * @example
   * // Retorna un Date con hora 6:00 AM del día actual
   * getFormattedTime();
   *
   * // Retorna "06:00" como string
   * getFormattedTime(false);
   *
   * // Retorna "15:30" como string para una fecha específica
   * getFormattedTime(false, new Date('2025-04-17'), 15, 30);
   */
  static getFormattedTime = (
    returnAsDate: boolean = true,
    date: Date = new Date(),
    hour: number = START_HOUR,
    minute: number = 0
  ): Date | string => {
    const customDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0);
    return returnAsDate
      ? customDate
      : customDate.toLocaleTimeString('es', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
  };

  /**
   * Devuelve la fecha actual en formato Date o como string formateado.
   *
   * @param {boolean} [returnAsDate=true] - Si es `true`, retorna un objeto `Date`. Si es `false`, retorna una cadena formateada.
   * @param {boolean} [longFormatDate=true] - Si es `true`, retorna la fecha en formato largo. Si es `false`, retorna en formato corto.
   * @param {boolean} [includeTime=true] - Si es `true`, incluye la hora en el formato. Si es `false`, solo la fecha.
   * @returns {Date | string} La fecha actual, como objeto Date o string formateado, según los parámetros.
   */
  static getCurrentDate = (
    returnAsDate: boolean = true,
    longFormatDate: boolean = true,
    includeTime: boolean = true
  ): Date | string => {
    const currentDate = new Date();
    return returnAsDate
      ? currentDate
      : longFormatDate
        ? DateUtils.formatLongDate(currentDate, includeTime)
        : DateUtils.formatShortDate(currentDate, includeTime);
  };

  /**
   * Verifica si una fecha está dentro del rango especificado.
   * @param rangoFechas - Array con dos strings de fechas: [inicio, fin]
   * @param fecha - Fecha a verificar (por defecto es hoy)
   * @returns true si la fecha está dentro del rango (inclusive), false en caso contrario
   */
  static isDateInRange(rangoFechas: [string, string], fecha: Date = new Date()): boolean {
    const [startStr, endStr] = rangoFechas;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const fechaNormalizada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    return fechaNormalizada >= start && fechaNormalizada <= end;
  }

  /**
   * Convierte un string de fecha en formato 'dd/mm/yyyy' (locale 'es') a un objeto Date.
   * @param dateStr - Cadena con formato 'día/mes/año', como '6/5/2025'
   * @returns Objeto Date correspondiente o `Invalid Date` si el formato es incorrecto
   */
  static parseLocaleDateString(dateStr: string): Date {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(NaN);
    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12) {
      return new Date(NaN);
    }
    return new Date(year, month - 1, day); // El mes es 0-indexado
  }

  /**
   * Formatea un objeto Date al formato `yyyy-MM-dd`, compatible con <input type="date" />.
   *
   * @param {Date} date - La fecha que se desea formatear.
   * @returns {string} - La fecha formateada como cadena en el formato `yyyy-MM-dd`.
   *
   * @example
   * formatDateToInput(new Date()); // "2025-06-02"
   */
  static formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }

  /**
   * Formatea un objeto Date al formato `yyyy-MM-ddTHH:mm`,
   * compatible con <input type="datetime-local" />.
   *
   * Se ajusta a la zona horaria local del navegador para evitar desfases con `toISOString()`.
   *
   * @param {Date} date - La fecha que se desea formatear.
   * @returns {string} - La fecha y hora formateadas como cadena en formato `yyyy-MM-ddTHH:mm`.
   *
   * @example
   * formatDateToDatetimeLocal(new Date()); // "2025-06-02T14:35"
   */
  static formatDateToDatetimeLocal(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }

  /**
   * Convierte una cadena en formato 'YYYY-MM-DD' a un objeto Date de JavaScript.
   * @param dateStr - Fecha en formato 'YYYY-MM-DD'.
   * @returns Objeto Date correspondiente.
   */
  static parseDate(dateStr: string): Date {
    return new Date(`${dateStr}T00:00`);
  }

  /**
   * Convierte una cadena en formato 'YYYY-MM-DDTHH:mm' a un objeto Date de JavaScript.
   * @param datetimeStr - Fecha y hora en formato 'YYYY-MM-DDTHH:mm'.
   * @returns Objeto Date correspondiente.
   */
  static parseDatetimeLocal(datetimeStr: string): Date {
    return new Date(datetimeStr);
  }
}

export {DateUtils};
