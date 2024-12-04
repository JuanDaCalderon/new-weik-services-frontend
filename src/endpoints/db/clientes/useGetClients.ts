import {useCallback} from 'react';
import {collection, getDocs, onSnapshot, query, Unsubscribe, where} from 'firebase/firestore';
import {db} from '@/firebase';
import {CLIENTES_PATH, MAIN_DOMAIN} from '@/constants';
import {DebugUtil} from '@/utils';
import {useDispatch} from 'react-redux';
import {clearClientes, setClientes} from '@/store/slices/clientes';
import {Cliente} from '@/types';

const useGetClients = () => {
  const dispatch = useDispatch();

  const getClientesListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(
        query(collection(db, CLIENTES_PATH), where('domain', '!=', MAIN_DOMAIN)),
        async (querySnapshotDocs) => {
          const clientes: Cliente[] = [];
          for (const doc of querySnapshotDocs.docs) {
            const {branding, logo, nombre, domain} = doc.data();
            clientes.push({
              id: doc.id,
              branding,
              logo,
              nombre,
              domain
            });
          }
          dispatch(clearClientes());
          dispatch(setClientes(clientes));
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
    try {
      const clientes: Cliente[] = [];
      const queryDocs = await getDocs(
        query(collection(db, CLIENTES_PATH), where('domain', '!=', MAIN_DOMAIN))
      );
      for (const doc of queryDocs.docs) {
        const {branding, logo, nombre, domain} = doc.data();
        clientes.push({
          id: doc.id,
          branding,
          logo,
          nombre,
          domain
        });
      }
      dispatch(setClientes(clientes));
      DebugUtil.logSuccess(
        'Se han consultado los clientes correctamente sync y ya deben estar en el store',
        clientes
      );
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [dispatch]);

  return {
    getClientesSync,
    getClientesListener
  };
};

export default useGetClients;
