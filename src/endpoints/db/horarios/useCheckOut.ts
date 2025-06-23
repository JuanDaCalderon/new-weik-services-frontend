import {doc, Timestamp, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {db} from '@/firebase';
import {useAppSelector} from '@/store';
import {HorasTrabajoToFirestore} from '@/types';
import {FIRESTORE_USUARIOS_PATH} from '@/constants';
import toast from 'react-hot-toast';
import {selectUser} from '@/store/selectores';
import {DateUtils, DebugUtil, calcularHorasTrabajo} from '@/utils';
import {useDispatch} from 'react-redux';
import {updateWorkingHoursUser} from '@/store/slices/user';

export default function useCheckOut() {
  const [isSavingCheckOut, setIsSavingCheckOut] = useState(false);
  const user = useAppSelector(selectUser);
  const todayDate = new Date().toLocaleDateString('es-ES');
  const dispatch = useDispatch();

  const checkOut = useCallback(async (): Promise<void> => {
    setIsSavingCheckOut(true);
    try {
      const {horasTrabajo = []} = user;
      const checkoutTime = new Date();
      if (horasTrabajo?.length <= 0) {
        toast.error('No tiene horas de trabajo registradas');
        return;
      }
      const updatedHorasTrabajo: HorasTrabajoToFirestore[] = horasTrabajo.map((h) => {
        if (h.dia === todayDate) {
          const workingTime = calcularHorasTrabajo(new Date(h.checkIn), checkoutTime);
          return {
            ...h,
            checkIn: Timestamp.fromDate(new Date(h.checkIn)),
            checkOut: Timestamp.now(),
            hasCheckOut: true,
            isInWorkingTime: false,
            ...workingTime
          };
        }
        return {
          ...h,
          checkIn: Timestamp.fromDate(new Date(h.checkIn)),
          checkOut: h.checkOut ? Timestamp.fromDate(new Date(h.checkOut)) : null
        };
      });
      const userRef = doc(db, FIRESTORE_USUARIOS_PATH, user.id);
      await updateDoc(userRef, {horasTrabajo: updatedHorasTrabajo});
      dispatch(
        updateWorkingHoursUser(
          updatedHorasTrabajo.map((h) => ({
            ...h,
            checkIn: DateUtils.formatDateToString(h.checkIn.toDate()),
            checkOut: h.checkOut ? DateUtils.formatDateToString(h.checkOut.toDate()) : null
          }))
        )
      );
      toast.success('Check-out Hecho');
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsSavingCheckOut(false);
    }
  }, [dispatch, todayDate, user]);

  return {
    isSavingCheckOut,
    checkOut
  };
}
