import {db} from '@/firebase';
import {collection, getDocs, onSnapshot, Unsubscribe} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {DateUtils, DebugUtil} from '@/utils';
import {isLoadingEventos, clearEventos, setEventos} from '@/store/slices/eventos';
import {EVENTOS_PATH} from '@/constants';
import {Eventos, EventosToDb} from '@/types';

export default function useGetEventos() {
  const dispatch = useDispatch();

  const getEventosSync = useCallback(async (): Promise<void> => {
    dispatch(isLoadingEventos(true));
    try {
      const querySnapshotDocs = await getDocs(collection(db, EVENTOS_PATH));
      const eventos: Eventos[] = querySnapshotDocs.docs.map((doc) => ({
        ...(doc.data() as Eventos),
        id: doc.id,
        rangoFechas: [
          DateUtils.formatDateToString((doc.data() as EventosToDb).rangoFechas[0].toDate()),
          DateUtils.formatDateToString((doc.data() as EventosToDb).rangoFechas[1].toDate())
        ]
      }));
      dispatch(clearEventos());
      dispatch(setEventos(eventos));
      DebugUtil.logSuccess('Eventos en el store correctamente', eventos);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    } finally {
      dispatch(isLoadingEventos(false));
    }
  }, [dispatch]);

  const getEventosListener = useCallback((): Unsubscribe => {
    dispatch(isLoadingEventos(true));
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, EVENTOS_PATH), async (querySnapshotDocs) => {
        const eventos: Eventos[] = [];
        querySnapshotDocs.forEach((doc) => {
          eventos.push({
            ...(doc.data() as Eventos),
            id: doc.id,
            rangoFechas: [
              DateUtils.formatDateToString((doc.data() as EventosToDb).rangoFechas[0].toDate()),
              DateUtils.formatDateToString((doc.data() as EventosToDb).rangoFechas[1].toDate())
            ]
          });
        });
        dispatch(clearEventos());
        dispatch(setEventos(eventos));
        dispatch(isLoadingEventos(false));
        DebugUtil.logSuccess('Eventos en el store correctamente', eventos);
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  return {
    getEventosSync,
    getEventosListener
  };
}
