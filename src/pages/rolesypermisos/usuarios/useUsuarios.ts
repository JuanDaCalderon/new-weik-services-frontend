import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores/users';
import {useMemo} from 'react';
import {thisUsuarios} from '@/types';

export default function useUsuarios() {
  const employeesFromStore = useAppSelector(selectEmployees);

  const usuarios: thisUsuarios[] = useMemo(() => {
    return employeesFromStore.map<thisUsuarios>((usuario) => {
      const {id, roles, permisosOtorgados, permisosDenegados} = usuario;
      return {
        id: +id,
        email: usuario.email,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        userName: usuario.userName,
        userImage: usuario.userImage,
        cargo: usuario.cargo,
        roles: roles,
        permisosOtorgados: permisosOtorgados,
        permisosDenegados: permisosDenegados
      } as thisUsuarios;
    });
  }, [employeesFromStore]);

  return {usuarios};
}
