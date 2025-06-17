import {CUSTOM_FIELD_TYPE} from '@/constants';
import {CustomFieldDefinition} from '@/types';

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
