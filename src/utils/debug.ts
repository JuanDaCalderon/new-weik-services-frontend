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
   * @param showTrace Indica si se debe mostrar el stack trace.
   */
  static logInfo<T>(message: string, data?: T, showTrace: boolean = false): void {
    if (data) console.info(`🚀 [INFO]: ${message}`, '📋 Data:', data);
    else console.info(`🚀 [INFO]: ${message}`);
    if (showTrace) console.info('📍 Stack Trace:\n', this.getStackTrace());
  }

  /**
   * Log para advertencias.
   * @param message Mensaje descriptivo.
   * @param data Datos opcionales adicionales.
   * @param showTrace Indica si se debe mostrar el stack trace.
   */
  static logWarning<T>(message: string, data?: T, showTrace: boolean = false): void {
    if (data) console.warn(`⚠️ [WARNING]: ${message}`, '📋 Data:', data);
    else console.warn(`⚠️ [WARNING]: ${message}`);
    if (showTrace) console.warn('📍 Stack Trace:\n', this.getStackTrace());
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
   * @param showTrace Indica si se debe mostrar el stack trace.
   */
  static logSuccess<T>(message: string, data?: T, showTrace: boolean = false): void {
    if (data) console.log(`✅ [SUCCESS]: ${message}`, '📋 Data:', data);
    else console.log(`✅ [SUCCESS]: ${message}`);
    if (showTrace) console.log('📍 Stack Trace:\n', this.getStackTrace());
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
    console.log(`${emoji} [REQUEST]: ${url} | Status: ${status} | Response Time: ${responseTime}ms`);
    if (data) console.log('📋 Data:', data);
    console.log('📍 Stack Trace:\n', this.getStackTrace());
  }

  /**
   * Log para depuración.
   * @param message Mensaje descriptivo.
   * @param data Datos opcionales adicionales.
   * @param showTrace Indica si se debe mostrar el stack trace.
   */
  static logDebug<T>(message: string, data?: T, showTrace: boolean = false): void {
    if (data) console.log(`🐞 [DEBUG]: ${message}`, '📋 Data:', data);
    else console.log(`🐞 [DEBUG]: ${message}`);
    if (showTrace) console.log('📍 Stack Trace:\n', this.getStackTrace());
  }
}

export {DebugUtil};
