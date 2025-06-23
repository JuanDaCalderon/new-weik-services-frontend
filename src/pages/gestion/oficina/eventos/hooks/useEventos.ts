import {useEffect, useMemo} from 'react';
import {useAppSelector} from '@/store';
import {selectEventos, selectIsLoadingEventos, selectUser} from '@/store/selectores';
import {useGetEventos} from '@/endpoints';
import {hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';

export default function useEventos() {
  const user = useAppSelector(selectUser);
  const eventos = useAppSelector(selectEventos);
  const isLoadingEventos = useAppSelector(selectIsLoadingEventos);
  const {getEventosListener} = useGetEventos();

  useEffect(() => {
    const unsubscribe = getEventosListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getEventosListener]);

  const canCrearEventos = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearEventos, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEditarEventos = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.editarEventos, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEliminarEventos = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.eliminarEventos, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return {
    thisUserActive: user,
    eventos,
    isLoadingEventos,
    canCrearEventos,
    canEditarEventos,
    canEliminarEventos
  };
}
