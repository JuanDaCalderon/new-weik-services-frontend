/**
 * Session Storage util class para manejar
 * todas las operaciones en el session storage
 */
class SessionStorageUtil {
  /**
   * Guarda un item en sessionStorage.
   * @param key Clave del item.
   * @param value Valor del item, puede ser cualquier tipo de dato serializable.
   */
  static setItem<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error: any) {
      console.error(`Error al guardar el item con clave "${key}" en sessionStorage`, error);
    }
  }

  /**
   * Obtiene un item desde sessionStorage.
   * @param key Clave del item.
   * @returns El valor deserializado o null si no existe.
   */
  static getItem<T>(key: string): T | null {
    try {
      const serializedValue = sessionStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error: any) {
      console.error(`Error al obtener el item con clave "${key}" desde sessionStorage`, error);
      return null;
    }
  }

  /**
   * Elimina un item del sessionStorage.
   * @param key Clave del item a eliminar.
   */
  static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error: any) {
      console.error(`Error al eliminar el item con clave "${key}" en sessionStorage`, error);
    }
  }

  /**
   * Actualiza un item en el sessionStorage.
   * @param key Clave del item a actualizar.
   * @param value Nuevo valor del item.
   */
  static updateItem<T>(key: string, value: T): void {
    SessionStorageUtil.setItem(key, value);
  }

  /**
   * Limpia todo el contenido del sessionStorage.
   */
  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error: any) {
      console.error(`Error al limpiar el sessionStorage`, error);
    }
  }
}

export {SessionStorageUtil};
