const START_HOUR = 6;
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
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const formattedDate: string = `${dayName}, ${date.getDate()} de ${monthName} de ${date.getFullYear()}`;
    if (includeTime) return `${formattedDate}, ${DateUtils.getTimeOnly(date)}`;
    return formattedDate;
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
}

export {DateUtils};
