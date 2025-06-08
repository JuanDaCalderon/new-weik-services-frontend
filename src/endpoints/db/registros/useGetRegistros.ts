import {useCallback, useEffect, useRef} from 'react';
import {db} from '@/firebase';
import {useDispatch} from 'react-redux';
import {DateUtils, DebugUtil} from '@/utils';
import {isLoadingRegistrosPerCliente, setRegistrosPerCliente} from '@/store/slices/registros';
import {collection, getDocs, onSnapshot, orderBy, query, QueryDocumentSnapshot, Unsubscribe} from 'firebase/firestore';
import {CLIENTES_PATH, REGISTRO_ASSIGNMENT, REGISTRO_STATUS, REGISTRO_PRIORIDAD} from '@/constants';
import {Registros, RegistrosToDb} from '@/types';

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
      asignacion: data.asignacion || REGISTRO_ASSIGNMENT.SINASIGNAR,
      estado: data.estado || REGISTRO_STATUS.PAUSA,
      prioridad: data.prioridad || REGISTRO_PRIORIDAD.MEDIA,
      tags: data.tags || [],
      numeroOrden: data.numeroOrden || '',
      createdBy: data.createdBy || '',
      updatedBy: data.updatedBy || '',
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
        const registrosRef = collection(db, `${CLIENTES_PATH}/${cliente}/${tipo}`);
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

  const getRegistroPerClienteTypeListener = useCallback(
    (cliente: string, tipo: string, shouldFilterEntregados = false) => {
      const key = `${cliente}_${tipo}`;
      if (unsubRefs.current[key]) {
        unsubRefs.current[key]();
      }
      dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: true}));
      const registrosRef = collection(db, `${CLIENTES_PATH}/${cliente}/${tipo}`);
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
    getRegistroPerClienteType,
    getRegistroPerClienteTypeListener,
    unsubscribeClienteTipo
  };
};

export default useGetRegistros;
