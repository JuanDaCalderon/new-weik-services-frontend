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
      throw new Error(
        'Formato de fecha no válido. El formato correcto es "YYYY/MM/DD, HH:MM:SS GMT-Z"'
      );
    }
    return new Date(dateString);
  }

  // Devuelve solo la fecha en formato 'YYYY/MM/DD'
  static getDateOnly(date: Date): string {
    const formattedDate = [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'), // Mes con 2 dígitos
      date.getDate().toString().padStart(2, '0') // Día con 2 dígitos
    ].join('/');
    return formattedDate;
  }

  // Devuelve solo la hora en formato 'HH:mm:ss'
  static getTimeOnly(date: Date): string {
    const time = [
      date.getHours().toString().padStart(2, '0'), // Hora con 2 dígitos
      date.getMinutes().toString().padStart(2, '0'), // Minutos con 2 dígitos
      date.getSeconds().toString().padStart(2, '0') // Segundos con 2 dígitos
    ].join(':');
    return time;
  }

  // Devuelve la fecha en formato largo (en español) con la hora incluida
  static formatLongDate(date: Date): string {
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const monthNames = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ];

    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    return `${dayName}, ${date.getDate()} de ${monthName} de ${date.getFullYear()}, ${DateUtils.getTimeOnly(
      date
    )}`;
  }

  /** Devuelve la fecha en formato corto (en español) con la hora incluida */
  static formatShortDate(date: Date): string {
    const monthNames = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic'
    ];
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}, ${DateUtils.getTimeOnly(date)}`;
  }
}

export {DateUtils};
