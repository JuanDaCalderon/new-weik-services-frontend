import {CUSTOM_FIELD_TYPE} from '@/constants';

export type CustomFieldDefinition = {
  key: string; // Identificador único del campo (nombre del custom field)
  type: CUSTOM_FIELD_TYPE; // Tipo de campo
  options?: string[]; // Solo aplica si el tipo es SELECT
};

export type TipoRegistro = {
  tipo: string; // "ppts", "motions"
  customFields: CustomFieldDefinition[]; // Campos personalizados para este tipo
};

export type Cliente = {
  id: string;
  nombre: string;
  domain: string;
  branding: string;
  logo: string;
  documento: string;
  fechaCreacion: string;
  telefonoCliente: string;
  nombrePersonaContacto: string;
  emailPersonaContacto: string;
  telefonoPersonaContacto: string;
  direccionFisicaCliente: string;
  idNitCliente: string;
  tiposRegistros: TipoRegistro[]; // Tipos de registros asociados al cliente
};

export type PayLoadClientType = {
  clientes: Cliente[];
  isLoading: boolean;
};
