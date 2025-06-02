import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {DebugUtil} from '@/utils';
import {clearRegistrosPerClienteAndTipo} from '@/store/slices/registros';

const useClearRegistros = () => {
  const dispatch = useDispatch();

  const clearRegistros = useCallback(
    (cliente: string, tipo: string) => {
      try {
        dispatch(clearRegistrosPerClienteAndTipo({cliente, tipo}));
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      }
    },
    [dispatch]
  );

  return {
    clearRegistros
  };
};

export default useClearRegistros;
