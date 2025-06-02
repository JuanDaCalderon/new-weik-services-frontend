import {useCallback} from 'react';
import {db} from '@/firebase';
import {useDispatch} from 'react-redux';
import {DateUtils, DebugUtil} from '@/utils';
import {isLoadingRegistrosPerCliente, setRegistrosPerCliente} from '@/store/slices/registros';
import {collection, getDocs, orderBy, query, QueryDocumentSnapshot} from 'firebase/firestore';
import {CLIENTES_PATH} from '@/constants';
import {REGISTRO_ASSIGNMENT, REGISTRO_PRIORIDAD, REGISTRO_STATUS, Registros, RegistrosToDb} from '@/types';

const useGetRegistros = () => {
  const dispatch = useDispatch();

  const getMapRegistros = useCallback((doc: QueryDocumentSnapshot): Registros => {
    return {
      ...(doc.data() as Registros),
      id: doc.id,
      nombre: (doc.data() as RegistrosToDb).nombre || '',
      link: (doc.data() as RegistrosToDb).link || '',
      cliente: (doc.data() as RegistrosToDb).cliente || '',
      solicitante: (doc.data() as RegistrosToDb).solicitante || '',
      encargado: (doc.data() as RegistrosToDb).encargado || '',
      asignacion: (doc.data() as RegistrosToDb).asignacion || REGISTRO_ASSIGNMENT.SINASIGNAR,
      estado: (doc.data() as RegistrosToDb).estado || REGISTRO_STATUS.PAUSA,
      prioridad: (doc.data() as RegistrosToDb).prioridad || REGISTRO_PRIORIDAD.MEDIA,
      tags: (doc.data() as RegistrosToDb).tags || [],
      numeroOrden: (doc.data() as RegistrosToDb).numeroOrden || '',
      createdBy: (doc.data() as RegistrosToDb).createdBy || '',
      updatedBy: (doc.data() as RegistrosToDb).updatedBy || '',
      ...((doc.data() as RegistrosToDb).customFields ? (doc.data() as RegistrosToDb).customFields : {}),
      createdAt: DateUtils.formatDateToString(
        (doc.data() as RegistrosToDb).createdAt ? (doc.data() as RegistrosToDb).createdAt.toDate() : new Date()
      ),
      deliverAt: DateUtils.formatDateToString(
        (doc.data() as RegistrosToDb).deliverAt ? (doc.data() as RegistrosToDb).deliverAt.toDate() : new Date()
      ),
      requestAt: DateUtils.formatDateToString(
        (doc.data() as RegistrosToDb).requestAt ? (doc.data() as RegistrosToDb).requestAt.toDate() : new Date()
      ),
      updatedAt: DateUtils.formatDateToString(
        (doc.data() as RegistrosToDb).updatedAt ? (doc.data() as RegistrosToDb).updatedAt.toDate() : new Date()
      ),
      comentarios: (doc.data() as RegistrosToDb).comentarios
        ? (doc.data() as RegistrosToDb).comentarios.map((comment) => ({
            comentario: comment.comentario,
            createdAt: DateUtils.formatDateToString(comment.createdAt ? comment.createdAt.toDate() : new Date()),
            createdBy: comment.createdBy || ''
          }))
        : []
    };
  }, []);

  const getRegistroPerClienteType = useCallback(
    async (cliente: string, tipo: string, shouldFilterEntregados: boolean = false): Promise<void> => {
      dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: true}));
      try {
        const registrosRef = collection(db, `${CLIENTES_PATH}/${cliente}/${tipo}`);
        const q = query(registrosRef, orderBy('deliverAt', 'asc'));
        const querySnapshotDocs = await getDocs(q);
        const allRegistros: Registros[] = querySnapshotDocs.docs.map((doc) => getMapRegistros(doc));
        let registros: Registros[] = [];
        if (shouldFilterEntregados) registros = allRegistros.filter((reg) => reg.estado === REGISTRO_STATUS.ENTREGADO);
        else registros = allRegistros.filter((reg) => reg.estado !== REGISTRO_STATUS.ENTREGADO);
        dispatch(setRegistrosPerCliente({registros, cliente, tipo}));
        DebugUtil.logSuccess('Todos los registros en el store correctamente', registros);
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      } finally {
        dispatch(isLoadingRegistrosPerCliente({cliente, tipo, isLoading: false}));
      }
    },
    [dispatch, getMapRegistros]
  );

  return {
    getRegistroPerClienteType
  };
};

export default useGetRegistros;
