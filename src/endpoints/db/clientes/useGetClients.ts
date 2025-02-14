import {useCallback} from 'react';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  Unsubscribe,
  where
} from 'firebase/firestore';
import {db} from '@/firebase';
import {CLIENTES_PATH, MAIN_DOMAIN} from '@/constants';
import {DateUtils, DebugUtil} from '@/utils';
import {useDispatch} from 'react-redux';
import {clearClientes, isLoadingClientes, setClientes} from '@/store/slices/clientes';
import {Cliente} from '@/types';

const useGetClients = () => {
  const dispatch = useDispatch();

  const getClientesListener = useCallback((): Unsubscribe => {
    dispatch(isLoadingClientes(true));
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(
        query(collection(db, CLIENTES_PATH), where('domain', '!=', MAIN_DOMAIN)),
        async (querySnapshotDocs) => {
          const clientes: Cliente[] = [];
          for (const doc of querySnapshotDocs.docs) {
            const {branding, logo, nombre, domain, fechaCreacion} = doc.data();
            clientes.push({
              id: doc.id,
              branding,
              logo,
              nombre,
              domain,
              fechaCreacion: fechaCreacion
                ? DateUtils.formatDateToString((fechaCreacion as Timestamp).toDate())
                : DateUtils.formatDateToString(new Date())
            });
          }
          dispatch(clearClientes());
          dispatch(setClientes(clientes));
          dispatch(isLoadingClientes(false));
          DebugUtil.logSuccess(
            'Se han consultado los clientes correctamente y ya deben estar en el store',
            clientes
          );
        }
      );
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  const getClientesSync = useCallback(async (): Promise<void> => {
    dispatch(isLoadingClientes(true));
    try {
      const clientes: Cliente[] = [];
      const queryDocs = await getDocs(
        query(collection(db, CLIENTES_PATH), where('domain', '!=', MAIN_DOMAIN))
      );
      for (const doc of queryDocs.docs) {
        const {branding, logo, nombre, domain, fechaCreacion} = doc.data();
        clientes.push({
          id: doc.id,
          branding,
          logo,
          nombre,
          domain,
          fechaCreacion: fechaCreacion
            ? DateUtils.formatDateToString((fechaCreacion as Timestamp).toDate())
            : DateUtils.formatDateToString(new Date())
        });
      }
      dispatch(clearClientes());
      dispatch(setClientes(clientes));
      DebugUtil.logSuccess(
        'Se han consultado los clientes correctamente sync y ya deben estar en el store',
        clientes
      );
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    } finally {
      dispatch(isLoadingClientes(false));
    }
  }, [dispatch]);

  return {
    getClientesSync,
    getClientesListener
  };
};

export default useGetClients;
