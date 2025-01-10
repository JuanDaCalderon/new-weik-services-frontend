import {useState, useCallback, ChangeEvent} from 'react';
import {validarContrasena} from '@/utils';
import toast from 'react-hot-toast';
import {useChangePassword} from '@/endpoints';

export default function usePassword() {
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {setChangePassword} = useChangePassword();

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setPasswordForm((prev) => ({...prev, [name]: value}));
    setIsFormChanged(true);
  }, []);

  const updateNewPassword = useCallback(async () => {
    setIsLoading(true);
    const {password, confirmPassword} = passwordForm;
    if (!password.trim() || !confirmPassword.trim()) {
      setIsFormChanged(false);
      setPasswordForm({
        password: '',
        confirmPassword: ''
      });
      toast.error('Las contraseñas no pueden estar vacías o contener solo espacios.');
      setIsLoading(false);
      return;
    }
    const {esValida, mensaje} = validarContrasena(password, confirmPassword);
    if (!esValida) {
      toast.error(mensaje);
      setIsLoading(false);
      return;
    }

    await setChangePassword(password);
    setIsLoading(false);
  }, [passwordForm, setChangePassword]);

  return {
    isLoading,
    passwordForm,
    isFormChanged,
    showPassword,
    setShowPassword,
    handleInputChange,
    updateNewPassword
  };
}
