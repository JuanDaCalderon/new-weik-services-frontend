import {useCallback} from 'react';
import {DateUtils} from '@/utils';
import useAddRegistros from '@/endpoints/db/registros/useAddRegistros';
import {REGISTRO_ASSIGNMENT, REGISTRO_PRIORIDAD, REGISTRO_STATUS} from '@/types';
import {RegistrosCrearFormFields} from '@/pages/clientes/registros/schemas/createRegistro';

export const useAgregarRegistros = (cliente: string | undefined, registerType: string) => {
  const {addRegistroPerClienteType, isSavingRegistro} = useAddRegistros();

  const addRegistro = useCallback(
    async (registro: RegistrosCrearFormFields) => {
      if (!cliente) return;
      await addRegistroPerClienteType(cliente, registerType, {
        cliente: registro.cliente,
        nombre: registro.nombre,
        link: registro.link,
        solicitante: registro.solicitante,
        encargado: registro.encargado || REGISTRO_ASSIGNMENT.SINASIGNAR,
        numeroOrden: registro.numeroOrden,
        estado: registro.estado || REGISTRO_STATUS.PAUSA,
        prioridad: registro.prioridad || REGISTRO_PRIORIDAD.SINPRIORIDAD,
        requestAt: DateUtils.parseDate(registro.requestAt),
        deliverAt: DateUtils.parseDatetimeLocal(registro.deliverAt),
        tags: [],
        comentarios: registro.comentarios
          ? [
              {
                comentario: registro.comentarios,
                createdAt: new Date()
              }
            ]
          : []
      });
    },
    [addRegistroPerClienteType, cliente, registerType]
  );

  return {
    addRegistro,
    isSavingRegistro
  };
};
