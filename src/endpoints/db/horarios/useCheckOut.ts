import {doc, setDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {db} from '@/firebase';
import {useAppSelector} from '@/store';
import {HorasTrabajoToFirestore} from '@/types';
import {USUARIOS_PATH} from '@/constants';
import toast from 'react-hot-toast';
import {selectUser} from '@/store/selectores';
import {DateUtils, DebugUtil, calcularHorasTrabajo} from '@/utils';
import {useDispatch} from 'react-redux';
import {updateWorkingHoursUser} from '@/store/slices/user';

export default function useCheckOut() {
  const [isSavingCheckOut, setIsSavingCheckOut] = useState(false);
  const user = useAppSelector(selectUser);
  const todayDate = new Date().toLocaleDateString();
  const dispatch = useDispatch();

  const checkOut = useCallback(async (): Promise<void> => {
    setIsSavingCheckOut(true);
    try {
      const {horasTrabajo = []} = user;
      const checkoutTime: Date = new Date();
      if (horasTrabajo?.length > 0) {
        const updatedHorasTrabajo: HorasTrabajoToFirestore[] = horasTrabajo.map((h) => {
          const {dia, checkIn} = h;
          if (dia === todayDate) {
            const workingTime = calcularHorasTrabajo(new Date(checkIn), checkoutTime);
            return {
              ...h,
              checkIn: Timestamp.fromDate(new Date(h.checkIn)),
              checkOut: Timestamp.now(),
              hasCheckOut: true,
              isInWorkingTime: false,
              ...workingTime
            };
          } else {
            return {
              ...h,
              checkIn: Timestamp.fromDate(new Date(h.checkIn)),
              checkOut: h.checkOut === null ? null : Timestamp.fromDate(new Date(h.checkOut))
            };
          }
        });
        const userRef = doc(db, USUARIOS_PATH, user.id);
        await setDoc(userRef, {horasTrabajo: updatedHorasTrabajo}, {merge: true});
        dispatch(
          updateWorkingHoursUser([
            ...updatedHorasTrabajo.map((h) => ({
              ...h,
              checkIn: DateUtils.formatDateToString(h.checkIn.toDate()),
              checkOut:
                h.checkOut === null ? null : DateUtils.formatDateToString(h.checkOut.toDate())
            }))
          ])
        );
        toast.success('Check-out Hecho');
      } else toast.error('No tiene horas de trabajo registradas');
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
