import {REGISTRO_ASSIGNMENT, REGISTRO_PRIORIDAD, REGISTRO_STATUS} from '@/constants';
import {DateUtils} from '@/utils';
import {object, string, InferType} from 'yup';

export const registrosCrearSchema = object({
  nombre: string().required('El nombre es requerido'),
  link: string().url('Debe ser una URL válida').required('El link es requerido'),
  cliente: string().required('El cliente es requerido'),
  solicitante: string().required('El solicitante es requerido'),
  encargado: string().required('El encargado es requerido').default(REGISTRO_ASSIGNMENT.SINASIGNAR),
  estado: string()
    .oneOf(Object.values(REGISTRO_STATUS), 'Estado inválido')
    .required('El estado es requerido')
    .default(REGISTRO_STATUS.PAUSA),
  prioridad: string()
    .oneOf(Object.values(REGISTRO_PRIORIDAD), 'Prioridad inválida')
    .required('La prioridad es requerida')
    .default(REGISTRO_PRIORIDAD.SINPRIORIDAD),
  numeroOrden: string().required('El número de orden es requerido'),
  requestAt: string().required('La fecha de solicitud es requerida').default(DateUtils.formatDateToInput(new Date())),
  deliverAt: string()
    .required('La fecha de entrega es requerida')
    .default(DateUtils.formatDateToDatetimeLocal(new Date())),
  comentarios: string().optional()
});

export const staticDefaultValues = {
  nombre: '',
  link: '',
  cliente: '',
  solicitante: '',
  encargado: REGISTRO_ASSIGNMENT.SINASIGNAR,
  estado: REGISTRO_STATUS.PAUSA,
  prioridad: REGISTRO_PRIORIDAD.SINPRIORIDAD,
  numeroOrden: '',
  requestAt: DateUtils.formatDateToInput(new Date()),
  deliverAt: DateUtils.formatDateToDatetimeLocal(new Date()),
  comentarios: ''
};

export type RegistrosCrearFormFields = InferType<typeof registrosCrearSchema>;
