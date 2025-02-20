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
}

export {DateUtils};
