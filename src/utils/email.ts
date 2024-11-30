/**
 * Extrae el dominio de un correo electrónico válido.
 * @param email Correo electrónico.
 * @returns El dominio del correo electrónico o un error si el correo no es válido.
 */
function extractDomain(email: string): string {
  // Validar que el email tenga un formato válido
  const emailRegex = /^[^\s@]+@([^\s@.]+)\.[a-z]{2,}$/i;
  const match = email.match(emailRegex);
  if (!match) {
    throw new Error('El correo electrónico proporcionado no es válido.');
  }
  return match[1];
}

export {extractDomain};
