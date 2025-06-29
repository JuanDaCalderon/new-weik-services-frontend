import {CUSTOM_FIELD_TYPE} from '@/constants';
import {CustomFieldDefinition, Registros} from '@/types';

/**
 * Generates default values for custom fields based on their type.
 *
 * @param {CustomFieldDefinition[]} customFields - Array of custom field definitions.
 * @returns {Record<string, string | number | boolean>} - Object with default values for each custom field.
 */
export const getCustomDefaults = (customFields: CustomFieldDefinition[]): Record<string, string | number | boolean> => {
  return Object.fromEntries(
    customFields.map((field) => {
      let defaultValue: string | number | boolean = '';
      switch (field.type) {
        case CUSTOM_FIELD_TYPE.BOOLEAN:
          defaultValue = false;
          break;
        case CUSTOM_FIELD_TYPE.NUMBER:
          defaultValue = 0;
          break;
        case CUSTOM_FIELD_TYPE.SELECT:
          defaultValue = field.options?.[0] ?? '';
          break;
        case CUSTOM_FIELD_TYPE.STRING:
        default:
          defaultValue = '';
      }
      return [field.key, defaultValue];
    })
  );
};

/**
 * Organiza una lista de registros en una estructura jerárquica, anidando subregistros
 * dentro del campo `subRows` de su registro padre correspondiente.
 *
 * Un subregistro se identifica mediante `isSubRegistro = true` y un `parentRegistroId`.
 * Si no es un subregistro, se considera un registro de nivel raíz.
 *
 * @param {Registros[]} registros - Arreglo plano de registros, que puede incluir subregistros.
 * @returns {Registros[]} - Arreglo de registros jerárquicos con subregistros anidados en `subRows`.
 */
export function organizeRegistrosConJerarquia(registros: Registros[]): Registros[] {
  const registrosMap: Map<string, Registros> = new Map();
  const registrosRaiz: Registros[] = [];

  for (const registro of registros) {
    registrosMap.set(registro.id, {...registro, subRows: []});
  }

  for (const registro of registros) {
    if (registro.isSubRegistro && registro.parentRegistroId) {
      const padre = registrosMap.get(registro.parentRegistroId);
      if (padre) {
        padre.subRows!.push(registrosMap.get(registro.id)!);
      } else {
        registrosRaiz.push(registrosMap.get(registro.id)!);
      }
    } else {
      registrosRaiz.push(registrosMap.get(registro.id)!);
    }
  }

  return registrosRaiz;
}
