import {db} from '@/firebase';
import {collection, DocumentData, getDocs, onSnapshot, QuerySnapshot, Unsubscribe} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {DateUtils, DebugUtil} from '@/utils';
import {clearObjetivos, isLoadingObjetivos, setObjetivos} from '@/store/slices/objetivos';
import {FIRESTORE_OBJETIVOS_PATH} from '@/constants';
import {Objetivos, ObjetivosToDb} from '@/types';

export default function useGetObjetivos() {
  const dispatch = useDispatch();

  const getObjetivos = useCallback((querySnapshotDocs: QuerySnapshot<DocumentData, DocumentData>): Objetivos[] => {
    return querySnapshotDocs.docs.map((doc) => ({
      ...(doc.data() as Objetivos),
      id: doc.id,
      createdAt: DateUtils.formatDateToString((doc.data() as ObjetivosToDb).createdAt.toDate()),
      ...((doc.data() as Objetivos).evaluation
        ? {
            evaluation: {
              ...(doc.data() as Objetivos).evaluation,
              stars: (doc.data() as ObjetivosToDb).evaluation?.stars || 0,
              wasReviewed: (doc.data() as ObjetivosToDb).evaluation?.wasReviewed || false,
              evaluatedAt: DateUtils.formatDateToString(
                (doc.data() as ObjetivosToDb).evaluation?.evaluatedAt.toDate() || new Date()
              )
            }
          }
        : {}),
      rangoFechas: [
        DateUtils.formatDateToString((doc.data() as ObjetivosToDb).rangoFechas[0].toDate()),
        DateUtils.formatDateToString((doc.data() as ObjetivosToDb).rangoFechas[1].toDate())
      ]
    }));
  }, []);

  const getObjetivosSync = useCallback(async (): Promise<void> => {
    dispatch(isLoadingObjetivos(true));
    try {
      const querySnapshotDocs = await getDocs(collection(db, FIRESTORE_OBJETIVOS_PATH));
      const objetivos: Objetivos[] = getObjetivos(querySnapshotDocs);
      dispatch(clearObjetivos());
      dispatch(setObjetivos(objetivos));
      DebugUtil.logSuccess('Objetivos en el store correctamente', objetivos);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    } finally {
      dispatch(isLoadingObjetivos(false));
    }
  }, [dispatch, getObjetivos]);

  const getObjetivosListener = useCallback((): Unsubscribe => {
    dispatch(isLoadingObjetivos(true));
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, FIRESTORE_OBJETIVOS_PATH), async (querySnapshotDocs) => {
        const objetivos: Objetivos[] = getObjetivos(querySnapshotDocs);
        dispatch(clearObjetivos());
        dispatch(setObjetivos(objetivos));
        dispatch(isLoadingObjetivos(false));
        DebugUtil.logSuccess('Objetivos en el store correctamente', objetivos);
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch, getObjetivos]);

  return {
    getObjetivosSync,
    getObjetivosListener
  };
}
