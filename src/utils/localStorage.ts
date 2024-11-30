/**
 * Local Storage util class para manejar
 * todas las operaciones en el local storage
 */
class LocalStorageUtil {
  /**
   * Guarda un item en localStorage.
   * @param key Clave del item.
   * @param value Valor del item, puede ser cualquier tipo de dato serializable.
   */
  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error: any) {
      console.error(`Error al guardar el item con clave "${key}" en localStorage`, error);
    }
  }

  /**
   * Obtiene un item desde localStorage.
   * @param key Clave del item.
   * @returns El valor deserializado o null si no existe.
   */
  static getItem<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error: any) {
      console.error(`Error al obtener el item con clave "${key}" desde localStorage`, error);
      return null;
    }
  }

  /**
   * Elimina un item del localStorage.
   * @param key Clave del item a eliminar.
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error: any) {
      console.error(`Error al eliminar el item con clave "${key}" en localStorage`, error);
    }
  }

  /**
   * Actualiza un item en el localStorage.
   * @param key Clave del item a actualizar.
   * @param value Nuevo valor del item.
   */
  static updateItem<T>(key: string, value: T): void {
    LocalStorageUtil.setItem(key, value);
  }

  /**
   * Limpia todo el contenido del localStorage.
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error: any) {
      console.error(`Error al limpiar el localStorage`, error);
    }
  }
}

export {LocalStorageUtil};
