import {useCallback, useEffect, useRef} from 'react';
import {db} from '@/firebase';
import {useDispatch} from 'react-redux';
import {DateUtils, DebugUtil} from '@/utils';
import {isLoadingRegistrosPerCliente, setRegistrosPerCliente} from '@/store/slices/registros';
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Unsubscribe,
  where
} from 'firebase/firestore';
import {FIRESTORE_CLIENTES_PATH, REGISTRO_STATUS, REGISTRO_PRIORIDAD, MAIN_DOMAIN} from '@/constants';
import {Registros, RegistrosToDb, TipoRegistro as TR} from '@/types';

const useGetRegistros = () => {
  const dispatch = useDispatch();
  const unsubRefs = useRef<Record<string, Unsubscribe>>({});

  const getMapRegistros = useCallback((doc: QueryDocumentSnapshot): Registros => {
    const data = doc.data() as RegistrosToDb;
    return {
      ...data,
      id: doc.id,
      nombre: data.nombre || '',
      link: data.link || '',
      cliente: data.cliente || '',
      solicitante: data.solicitante || '',
      encargado: data.encargado || '',
      estado: data.estado || REGISTRO_STATUS.PAUSA,
      prioridad: data.prioridad || REGISTRO_PRIORIDAD.MEDIA,
      numeroOrden: data.numeroOrden || '',
      createdBy: data.createdBy || '',
      updatedBy: data.updatedBy || '',
      isSubRegistro: data.isSubRegistro || false,
      ...(data.parentRegistroId ? {parentRegistroId: data.parentRegistroId} : {}),
      ...(data.customFields ? data.customFields : {}),
      createdAt: DateUtils.formatDateToString(data.createdAt ? data.createdAt.toDate() : new Date()),
      deliverAt: DateUtils.formatDateToString(data.deliverAt ? data.deliverAt.toDate() : new Date()),
      requestAt: DateUtils.formatDateToString(data.requestAt ? data.requestAt.toDate() : new Date()),
      updatedAt: DateUtils.formatDateToString(data.updatedAt ? data.updatedAt.toDate() : new Date()),
      comentarios: data.comentarios
        ? data.comentarios.map((comment) => ({
            comentario: comment.comentario,
            createdAt: DateUtils.formatDateToString(comment.createdAt ? comment.createdAt.toDate() : new Date()),
            createdBy: comment.createdBy || ''
          }))
        : []
    };
  }, []);

  const getRegistroPerClienteType = useCallback(
    async (cliente: string, tipo: string, shouldFilterEntregados = false): Promise<void> => {
      dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: true}));
      try {
        const registrosRef = collection(db, `${FIRESTORE_CLIENTES_PATH}/${cliente}/${tipo}`);
        const q = query(registrosRef, orderBy('deliverAt', 'asc'));
        const querySnapshotDocs = await getDocs(q);
        const allRegistros: Registros[] = querySnapshotDocs.docs.map(getMapRegistros);
        const registros = shouldFilterEntregados
          ? allRegistros.filter((r) => r.estado === REGISTRO_STATUS.ENTREGADO)
          : allRegistros.filter((r) => r.estado !== REGISTRO_STATUS.ENTREGADO);
        dispatch(setRegistrosPerCliente({registros, cliente, tipo}));
        DebugUtil.logSuccess(`Registros ${cliente} ${tipo} en el store correctamente`, registros);
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      } finally {
        dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: false}));
      }
    },
    [dispatch, getMapRegistros]
  );

  const getSyncRegistros = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, FIRESTORE_CLIENTES_PATH), where('domain', '!=', MAIN_DOMAIN))
      );
      for (const doc of querySnapshot.docs) {
        const cliente = doc.data()?.domain as string;
        const tiposRegistros = ((doc.data()?.tiposRegistros || []) as TR[]).map(({tipo}) => tipo.toUpperCase());
        if (cliente) {
          for (const tipo of tiposRegistros) {
            await getRegistroPerClienteType(cliente, tipo);
          }
          DebugUtil.logSuccess(`Registros sincronizados para el cliente: ${cliente}`);
        }
      }
    } catch (error: any) {
      DebugUtil.logError('Error al sincronizar registros: ' + error.message, error);
    }
  }, [getRegistroPerClienteType]);

  const getRegistroPerClienteTypeListener = useCallback(
    (cliente: string, tipo: string, shouldFilterEntregados = false) => {
      const key = `${cliente}_${tipo}`;
      if (unsubRefs.current[key]) {
        unsubRefs.current[key]();
      }
      dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: true}));
      const registrosRef = collection(db, `${FIRESTORE_CLIENTES_PATH}/${cliente}/${tipo}`);
      const q = query(registrosRef, orderBy('deliverAt', 'asc'));
      const unsubscribe = onSnapshot(
        q,
        (querySnapshotDocs) => {
          const allRegistros: Registros[] = querySnapshotDocs.docs.map(getMapRegistros);
          const registros = shouldFilterEntregados
            ? allRegistros.filter((r) => r.estado === REGISTRO_STATUS.ENTREGADO)
            : allRegistros.filter((r) => r.estado !== REGISTRO_STATUS.ENTREGADO);
          dispatch(setRegistrosPerCliente({registros, cliente, tipo}));
          DebugUtil.logSuccess(`Registros ${key} actualizados en tiempo real`, registros);
          dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: false}));
        },
        (error: any) => {
          DebugUtil.logError('Error escuchando registros: ' + error.message, error);
          dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: false}));
        }
      );
      unsubRefs.current[key] = unsubscribe;
    },
    [dispatch, getMapRegistros]
  );

  const unsubscribeClienteTipo = useCallback((cliente: string, tipo: string) => {
    const key = `${cliente}_${tipo}`;
    if (unsubRefs.current[key]) {
      unsubRefs.current[key]();
      delete unsubRefs.current[key];
      DebugUtil.logInfo(`Unsubscribed temporalmente de ${key}`);
    }
  }, []);

  useEffect(() => {
    const currentUnsubs = unsubRefs.current;
    return () => {
      DebugUtil.logDebug('Limpiando listeners activos de registros', currentUnsubs);
      Object.values(currentUnsubs).forEach((unsub) => unsub());
    };
  }, [unsubRefs]);

  return {
    getSyncRegistros,
    getRegistroPerClienteType,
    getRegistroPerClienteTypeListener,
    unsubscribeClienteTipo
  };
};

export default useGetRegistros;
