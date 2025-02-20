/**
 * Valida si una contraseña cumple con los requisitos:
 * - Mínimo 6 caracteres.
 * - Debe contener letras, números y al menos una mayúscula.
 * - Debe coincidir con la confirmación.
 *
 * @param contrasena - La nueva contraseña.
 * @param confirmacion - La confirmación de la contraseña.
 * @returns Un objeto con el estado de validación y un mensaje explicativo.
 */

const validarContrasena = (contrasena: string, confirmacion: string): {esValida: boolean; mensaje: string} => {
  if (contrasena !== confirmacion) return {esValida: false, mensaje: 'Las contraseñas no coinciden.'};
  if (contrasena.length < 6) return {esValida: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.'};
  if (!/[0-9]/.test(contrasena)) return {esValida: false, mensaje: 'La contraseña debe contener al menos un número.'};
  if (!/[A-Z]/.test(contrasena))
    return {esValida: false, mensaje: 'La contraseña debe contener al menos una letra mayúscula.'};
  return {esValida: true, mensaje: 'La contraseña es válida.'};
};

export {validarContrasena};
