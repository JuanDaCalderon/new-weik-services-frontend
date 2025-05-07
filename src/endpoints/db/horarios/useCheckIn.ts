import {arrayUnion, doc, Timestamp, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {db} from '@/firebase';
import {useAppSelector} from '@/store';
import {HorasTrabajoToFirestore} from '@/types';
import {USUARIOS_PATH} from '@/constants';
import toast from 'react-hot-toast';
import {selectUser} from '@/store/selectores';
import {DateUtils, DebugUtil} from '@/utils';
import {useDispatch} from 'react-redux';
import {updateWorkingHoursUser} from '@/store/slices/user';

export default function useCheckIn() {
  const [isSavingCheckIn, setIsSavingCheckIn] = useState(false);
  const user = useAppSelector(selectUser);
  const todayDate = new Date().toLocaleDateString('es-ES');
  const dispatch = useDispatch();

  const createNewWorkEntry = useCallback(
    () => ({
      isInWorkingTime: true,
      checkIn: Timestamp.now(),
      hasCheckIn: true,
      checkOut: null,
      hasCheckOut: false,
      dia: todayDate,
      tiempoDeTrabajoEnSegundos: 0,
      horasDeTrabajo: 0,
      minutosDeTrabajo: 0,
      tiempoDeTrabajoExtraEnSegundos: 0,
      horasDeTrabajoExtra: 0,
      minutosDeTrabajoExtra: 0
    }),
    [todayDate]
  );

  const checkIn = useCallback(async (): Promise<void> => {
    setIsSavingCheckIn(true);
    try {
      const {horasTrabajo = []} = user;
      let updatedHorasTrabajo: HorasTrabajoToFirestore[];
      const dayExists = horasTrabajo.some((h) => h.dia === todayDate);
      const userRef = doc(db, USUARIOS_PATH, user.id);
      if (dayExists) {
        updatedHorasTrabajo = horasTrabajo.map((h) =>
          h.dia === todayDate
            ? {
                ...h,
                isInWorkingTime: h.isInWorkingTime ?? true,
                checkIn: Timestamp.now(),
                hasCheckIn: h.hasCheckIn ?? true,
                checkOut: h.checkOut ? Timestamp.fromDate(new Date(h.checkOut)) : null,
                hasCheckOut: h.hasCheckOut ?? false
              }
            : {
                ...h,
                checkIn: Timestamp.fromDate(new Date(h.checkIn)),
                checkOut: h.checkOut ? Timestamp.fromDate(new Date(h.checkOut)) : null
              }
        );
        await updateDoc(userRef, {horasTrabajo: updatedHorasTrabajo});
      } else {
        const newEntry = createNewWorkEntry();
        await updateDoc(userRef, {
          horasTrabajo: arrayUnion(newEntry)
        });
        updatedHorasTrabajo = [
          ...horasTrabajo.map((h) => ({
            ...h,
            checkIn: Timestamp.fromDate(new Date(h.checkIn)),
            checkOut: h.checkOut ? Timestamp.fromDate(new Date(h.checkOut)) : null
          })),
          newEntry
        ];
      }
      dispatch(
        updateWorkingHoursUser(
          updatedHorasTrabajo.map((h) => ({
            ...h,
            checkIn: DateUtils.formatDateToString(h.checkIn.toDate()),
            checkOut: h.checkOut ? DateUtils.formatDateToString(h.checkOut.toDate()) : null
          }))
        )
      );
      toast.success('Check-in Hecho');
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsSavingCheckIn(false);
    }
  }, [createNewWorkEntry, dispatch, todayDate, user]);

  return {
    isSavingCheckIn,
    checkIn
  };
}
