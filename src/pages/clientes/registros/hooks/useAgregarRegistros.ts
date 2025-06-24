import {useCallback} from 'react';
import {DateUtils, removeUndefined} from '@/utils';
import useAddRegistros from '@/endpoints/db/registros/useAddRegistros';
import {REGISTRO_ASSIGNMENT, REGISTRO_PRIORIDAD, REGISTRO_STATUS} from '@/constants';
import {RegistrosCrearFormFields} from '@/pages/clientes/registros/schemas/createRegistro';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

export const useAgregarRegistros = (cliente: string | undefined, registerType: string) => {
  const {id} = useAppSelector(selectUser);
  const {addRegistroPerClienteType, isSavingRegistro} = useAddRegistros();

  const addRegistro = useCallback(
    async (registro: RegistrosCrearFormFields & Record<string, any>) => {
      if (!cliente) return;
      await addRegistroPerClienteType(cliente, registerType, {
        ...removeUndefined(registro),
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
        isSubRegistro: registro.isSubRegistro || false,
        comentarios: registro.comentarios
          ? [
              {
                createdBy: id,
                comentario: registro.comentarios,
                createdAt: new Date()
              }
            ]
          : []
      });
    },
    [addRegistroPerClienteType, cliente, id, registerType]
  );

  return {
    addRegistro,
    isSavingRegistro
  };
};
