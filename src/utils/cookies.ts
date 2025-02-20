/**
 * CookieUtil class para manejar todas las operaciones con cookies
 */
class CookieUtil {
  /**
   * Guarda una cookie con opciones personalizadas.
   * @param key Clave de la cookie.
   * @param value Valor de la cookie, puede ser cualquier dato serializable.
   * @param options Opciones de configuración de la cookie (expiración, path, secure, etc.).
   */
  static setItem<T>(
    key: string,
    value: T,
    options: {
      expires?: number; // Expiración en minutos
      path?: string;
      domain?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ): void {
    try {
      let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;

      if (options.expires) {
        const expires = new Date(Date.now() + options.expires * 60 * 1000).toUTCString();
        cookieString += `; expires=${expires}`;
      }

      if (options.path) cookieString += `; path=${options.path}`;
      if (options.domain) cookieString += `; domain=${options.domain}`;
      if (options.secure) cookieString += `; secure`;
      if (options.httpOnly) cookieString += `; HttpOnly`;
      if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

      document.cookie = cookieString;
    } catch (error: any) {
      console.error(`Error al guardar la cookie con clave "${key}"`, error);
    }
  }

  /**
   * Obtiene una cookie y la deserializa.
   * @param key Clave de la cookie.
   * @returns El valor de la cookie o null si no existe.
   */
  static getItem<T>(key: string): T | null {
    try {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.split('=');
        if (decodeURIComponent(cookieKey) === key) {
          return JSON.parse(decodeURIComponent(cookieValue));
        }
      }
      return null;
    } catch (error: any) {
      console.error(`Error al obtener la cookie con clave "${key}"`, error);
      return null;
    }
  }

  /**
   * Elimina una cookie estableciendo su expiración en el pasado.
   * @param key Clave de la cookie.
   * @param path Path de la cookie (requerido si se estableció previamente).
   * @param domain Domain de la cookie (requerido si se estableció previamente).
   */
  static removeItem(key: string, path: string = '/', domain?: string): void {
    try {
      let cookieString = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      if (domain) cookieString += `; domain=${domain}`;
      document.cookie = cookieString;
    } catch (error: any) {
      console.error(`Error al eliminar la cookie con clave "${key}"`, error);
    }
  }

  /**
   * Intenta eliminar una cookie sobrescribiéndola con un valor vacío antes de eliminarla.
   * @param key Clave de la cookie.
   * @param path Path de la cookie (requerido si se estableció previamente).
   * @param domain Domain de la cookie (requerido si se estableció previamente).
   */
  static removeItemAlternative(key: string, path: string = '/', domain?: string): void {
    try {
      let cookieString = `${encodeURIComponent(key)}=; path=${path}; max-age=0`;
      if (domain) cookieString += `; domain=${domain}`;
      document.cookie = cookieString;
    } catch (error: any) {
      console.error(`Error al eliminar la cookie con clave "${key}" usando el método alternativo`, error);
    }
  }

  /**
   * Actualiza una cookie con un nuevo valor y opciones.
   * @param key Clave de la cookie.
   * @param value Nuevo valor de la cookie.
   * @param options Opciones de configuración de la cookie.
   */
  static updateItem<T>(
    key: string,
    value: T,
    options?: {
      expires?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    }
  ): void {
    this.setItem(key, value, options);
  }

  /**
   * Limpia todas las cookies disponibles en el documento.
   */
  static clear(): void {
    try {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [cookieKey] = cookie.split('=');
        this.removeItem(decodeURIComponent(cookieKey));
      }
    } catch (error: any) {
      console.error(`Error al limpiar todas las cookies`, error);
    }
  }
}

export {CookieUtil};
