import {db} from '@/firebase';
import {collection, getDocs, onSnapshot, Unsubscribe} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {DateUtils, DebugUtil} from '@/utils';
import {clearVacaciones, isLoadingVacaciones, setVacaciones} from '@/store/slices/vacaciones';
import {FIRESTORE_VACACIONES_PATH} from '@/constants';
import {Vacaciones, VacacionesToFirestore} from '@/types';

export default function useGetVacaciones() {
  const dispatch = useDispatch();

  const getVacacionesSync = useCallback(async (): Promise<void> => {
    dispatch(isLoadingVacaciones(true));
    try {
      const querySnapshotDocs = await getDocs(collection(db, FIRESTORE_VACACIONES_PATH));
      const vacaciones: Vacaciones[] = querySnapshotDocs.docs.map((doc) => ({
        ...(doc.data() as Vacaciones),
        id: doc.id,
        rangoFechas: [
          DateUtils.formatDateToString((doc.data() as VacacionesToFirestore).rangoFechas[0].toDate()),
          DateUtils.formatDateToString((doc.data() as VacacionesToFirestore).rangoFechas[1].toDate())
        ]
      }));
      dispatch(clearVacaciones());
      dispatch(setVacaciones(vacaciones));
      DebugUtil.logSuccess('Vacaciones en el store correctamente', vacaciones);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    } finally {
      dispatch(isLoadingVacaciones(false));
    }
  }, [dispatch]);

  const getVacacionesListener = useCallback((): Unsubscribe => {
    dispatch(isLoadingVacaciones(true));
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, FIRESTORE_VACACIONES_PATH), async (querySnapshotDocs) => {
        const vacaciones: Vacaciones[] = [];
        querySnapshotDocs.forEach((doc) => {
          vacaciones.push({
            ...(doc.data() as Vacaciones),
            id: doc.id,
            rangoFechas: [
              DateUtils.formatDateToString((doc.data() as VacacionesToFirestore).rangoFechas[0].toDate()),
              DateUtils.formatDateToString((doc.data() as VacacionesToFirestore).rangoFechas[1].toDate())
            ]
          });
        });
        dispatch(clearVacaciones());
        dispatch(setVacaciones(vacaciones));
        dispatch(isLoadingVacaciones(false));
        DebugUtil.logSuccess('Vacaciones en el store correctamente', vacaciones);
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  return {
    getVacacionesSync,
    getVacacionesListener
  };
}
