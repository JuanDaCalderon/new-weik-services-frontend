import {useState, useCallback, useEffect, ChangeEvent} from 'react';
import {DateUtils, DebugUtil, getUpdatedFields} from '@/utils';
import toast from 'react-hot-toast';
import {Employee} from '@/types';
import {selectUser} from '@/store/selectores';
import {useAppSelector} from '@/store';
import {useUpdateUser} from '@/endpoints';

const fieldNames: {[K in keyof Employee]?: string} = {
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  userName: 'Nombre de usuario',
  numeroDocumento: 'Número de documento',
  ciudadExpedicionDocumento: 'Lugar de expedición'
};

export default function useUpdateData() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    userName: '',
    fechaNacimiento: '',
    numeroDocumento: '',
    ciudadExpedicionDocumento: ''
  });
  const user = useAppSelector(selectUser);
  const {updateUserData} = useUpdateUser();

  useEffect(() => {
    setFormData({
      nombres: user.nombres,
      apellidos: user.apellidos,
      ciudadExpedicionDocumento: user.ciudadExpedicionDocumento,
      userName: user.userName,
      numeroDocumento: user.numeroDocumento,
      fechaNacimiento:
        DateUtils.getDateOnly(DateUtils.parseStringToDate(user.fechaNacimiento), '-') ?? ''
    });
    setIsFormChanged(false);
  }, [
    user.apellidos,
    user.ciudadExpedicionDocumento,
    user.fechaNacimiento,
    user.nombres,
    user.numeroDocumento,
    user.userName
  ]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData((prev) => {
        const updated = {...prev, [name]: value};
        const changes = getUpdatedFields(user, updated);
        setIsFormChanged(Object.keys(changes).length > 0);
        return updated;
      });
    },
    [user]
  );

  const updateData = useCallback(async () => {
    setIsLoading(true);
    try {
      const newFormData: typeof formData = {
        ...formData,
        fechaNacimiento: DateUtils.formatDateToString(
          new Date(formData.fechaNacimiento.replaceAll('-', '/'))
        )
      };
      const changes = getUpdatedFields<Employee>(user, newFormData);
      if (Object.keys(changes).length === 0) {
        toast.error('No hay cambios realizados');
        return;
      }
      const emptyFields = Object.entries(fieldNames)
        .filter(([key]) => (changes as any)[key] === '')
        .map(([key, label]) => ({key, label}));
      if (emptyFields.length > 0) {
        const fieldLabels = emptyFields.map((field) => field.label).join(', ');
        toast.error(`Los siguientes campos no deben estar vacíos: ${fieldLabels}`);
        return;
      }
      if (changes.userName && /\s/.test(changes.userName)) {
        toast.error('El nombre de usuario no debe tener espacios.');
        return;
      }
      await updateUserData(changes, user.id);
    } catch (error: any) {
      DebugUtil.logError(error.toString(), error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, updateUserData, user]);

  return {formData, isLoading, isFormChanged, updateData, handleInputChange};
}
