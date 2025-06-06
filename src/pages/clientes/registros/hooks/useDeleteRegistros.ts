import {useCallback} from 'react';
import useRemoveRegistros from '@/endpoints/db/registros/useRemoveRegistros';
import {SelectedRowType} from '@/types';

export const useDeleteRegistros = (cliente: string | undefined, registerType: string) => {
  const {deleteRegistro, isDeletingRegistro} = useRemoveRegistros();

  const onDeleteRegistro = useCallback(
    async (selectedRegistros: SelectedRowType[]) => {
      if (!cliente) return;
      await deleteRegistro(
        cliente,
        registerType,
        selectedRegistros.map((registro) => registro.id)
      );
    },
    [cliente, deleteRegistro, registerType]
  );

  return {
    onDeleteRegistro,
    isDeletingRegistro
  };
};
