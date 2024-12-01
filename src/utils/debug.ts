class DebugUtil {
  /**
   * Obtiene el stack trace del punto donde se llama este método.
   * @returns Un string con el stack trace limpio y legible.
   */
  private static getStackTrace(): string {
    const stack =
      new Error().stack
        ?.split('\n')
        .slice(2)
        .map((line) => line.trim()) || [];
    return stack.join('\n');
  }

  /**
   * Log para información general.
   * @param message Mensaje descriptivo.
   * @param data Datos opcionales adicionales.
   */
  static logInfo<T>(message: string, data?: T): void {
    console.info(`🚀 [INFO]: ${message}`);
    if (data) console.info('📋 Data:', data);
    console.info('📍 Stack Trace:\n', this.getStackTrace());
  }

  /**
   * Log para advertencias.
   * @param message Mensaje descriptivo.
   * @param data Datos opcionales adicionales.
   */
  static logWarning<T>(message: string, data?: T): void {
    console.warn(`⚠️ [WARNING]: ${message}`);
    if (data) console.warn('📋 Data:', data);
    console.warn('📍 Stack Trace:\n', this.getStackTrace());
  }

  /**
   * Log para errores.
   * @param message Mensaje descriptivo del error.
   * @param error Instancia opcional de Error o mensaje adicional.
   */
  static logError(message: string, error?: Error | string): void {
    console.error(`❌ [ERROR]: ${message}`);
    if (error instanceof Error) {
      console.error('🛑 Error Message:', error.message);
      console.error('🛑 Stack Trace:', error.stack);
    } else if (typeof error === 'string') {
      console.error('🛑 Error Description:', error);
    }
    console.error('📍 Caller Stack Trace:\n', this.getStackTrace());
  }

  /**
   * Log para mensajes de éxito.
   * @param message Mensaje descriptivo.
   * @param data Datos opcionales adicionales.
   */
  static logSuccess<T>(message: string, data?: T): void {
    console.log(`✅ [SUCCESS]: ${message}`);
    if (data) console.log('📋 Data:', data);
    console.log('📍 Stack Trace:\n', this.getStackTrace());
  }

  /**
   * Log para el estado de un request.
   * @param url URL del request.
   * @param status Código de estado HTTP.
   * @param responseTime Tiempo de respuesta en milisegundos.
   * @param data Datos opcionales relacionados con el request.
   */
  static logRequestStatus<T>(url: string, status: number, responseTime: number, data?: T): void {
    const emoji = status >= 200 && status < 300 ? '🟢' : '🔴';
    console.log(
      `${emoji} [REQUEST]: ${url} | Status: ${status} | Response Time: ${responseTime}ms`
    );
    if (data) console.log('📋 Data:', data);
    console.log('📍 Stack Trace:\n', this.getStackTrace());
  }

  /**
   * Log para depuración.
   * @param message Mensaje descriptivo.
   * @param data Datos opcionales adicionales.
   */
  static logDebug<T>(message: string, data?: T): void {
    console.debug(`🐞 [DEBUG]: ${message}`);
    if (data) console.debug('📋 Data:', data);
    console.debug('📍 Stack Trace:\n', this.getStackTrace());
  }
}

export {DebugUtil};
