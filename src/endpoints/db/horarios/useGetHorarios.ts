import {db} from '@/firebase';
import {collection, getDocs, onSnapshot, Unsubscribe} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {DateUtils, DebugUtil} from '@/utils';
import {isLoadingHorarios, clearHorarios, setHorarios} from '@/store/slices/horarios';
import {FIRESTORE_HORARIOS_PATH} from '@/constants';
import {Horario, HorarioToFirestore} from '@/types';

export default function useGetHorarios() {
  const dispatch = useDispatch();

  const getHorariosSync = useCallback(async (): Promise<void> => {
    dispatch(isLoadingHorarios(true));
    try {
      const querySnapshotDocs = await getDocs(collection(db, FIRESTORE_HORARIOS_PATH));
      const horarios: Horario[] = querySnapshotDocs.docs.map((doc) => ({
        ...(doc.data() as Horario),
        id: doc.id,
        rangoFechas: [
          DateUtils.formatDateToString((doc.data() as HorarioToFirestore).rangoFechas[0].toDate()),
          DateUtils.formatDateToString((doc.data() as HorarioToFirestore).rangoFechas[1].toDate())
        ]
      }));
      dispatch(clearHorarios());
      dispatch(setHorarios(horarios));
      DebugUtil.logSuccess('Horarios en el store correctamente', horarios);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    } finally {
      dispatch(isLoadingHorarios(false));
    }
  }, [dispatch]);

  const getHorariosListener = useCallback((): Unsubscribe => {
    dispatch(isLoadingHorarios(true));
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, FIRESTORE_HORARIOS_PATH), async (querySnapshotDocs) => {
        const horarios: Horario[] = [];
        querySnapshotDocs.forEach((doc) => {
          horarios.push({
            ...(doc.data() as Horario),
            id: doc.id,
            rangoFechas: [
              DateUtils.formatDateToString((doc.data() as HorarioToFirestore).rangoFechas[0].toDate()),
              DateUtils.formatDateToString((doc.data() as HorarioToFirestore).rangoFechas[1].toDate())
            ]
          });
        });
        dispatch(clearHorarios());
        dispatch(setHorarios(horarios));
        dispatch(isLoadingHorarios(false));
        DebugUtil.logSuccess('Horarios en el store correctamente', horarios);
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  return {
    getHorariosSync,
    getHorariosListener
  };
}
