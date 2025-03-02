import {Spinner} from '@/components';
import {useUpdateUser} from '@/endpoints';
import {useAppSelector} from '@/store';
import {permisosSelector} from '@/store/selectores';
import {PermisoByRoles, thisUsuarios} from '@/types';
import {getNombreCompletoUser} from '@/utils';
import {Row as RowTable} from '@tanstack/react-table';
import {memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import toast from 'react-hot-toast';

const PermisosDenegados = memo(function PermisosDenegados({row}: {row: RowTable<thisUsuarios>}) {
  const permisosFromStore = useAppSelector(permisosSelector);
  const permisosIniciales = useMemo(() => {
    return permisosFromStore.map<PermisoByRoles>((permiso) => {
      return {
        ...permiso,
        activo: row.original.permisosDenegados.some((permisoEncontrado) => permisoEncontrado.id === permiso.id)
      };
    });
  }, [permisosFromStore, row.original.permisosDenegados]);
  const htmlForSwitchPermiso: string = useMemo(() => {
    return `${row.original.email}`;
  }, [row.original.email]);

  const {updatePermisosDenegadosOfUser, isLoadingUpdatePermisosDenegados} = useUpdateUser();

  const [thisPermisos, setThisPermisos] = useState<PermisoByRoles[]>(permisosIniciales);
  const [hasTouched, setHasTouched] = useState<boolean>(false);

  const handleToggleChange = useCallback((id: string) => {
    setThisPermisos((prevP) => prevP.map((p) => (p.id === id ? {...p, activo: !p.activo} : {...p})));
    setHasTouched(true);
  }, []);

  const enviarPermisos = useCallback(async () => {
    const permisosCambiados = thisPermisos.filter((permiso, i) => permiso.activo !== permisosIniciales[i].activo);
    if (permisosCambiados.length > 0) {
      await updatePermisosDenegadosOfUser(String(row.original.id), permisosCambiados);
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [permisosIniciales, row.original.id, thisPermisos, updatePermisosDenegadosOfUser]);

  return (
    <Row className="m-0 py-2 column-gap-1 bg-light-subtle">
      <span>
        <i className="mdi mdi-arrow-up-left-bold font-16" />
        <strong>Permisos denegados del usuario {getNombreCompletoUser(row.original)}</strong>
      </span>
      <p className="my-0 py-0">
        Quita permisos independientes del rol a este usuario utilizando los interruptores que se encuentran a
        continuación. Recuerda que, al realizar esta acción, estás denegando permisos al agregarlos. Activa o desactiva
        según sea necesario y, posteriormente, guarda los cambios.
      </p>
      <Col className="p-0 m-0" xs={12}>
        <Row className="p-0 m-0">
          {thisPermisos.map(({id, permiso, labelName, activo}) => (
            <Col key={id} className="d-flex justify-content-between align-items-center mt-2" xs={2}>
              <span className="me-1">{labelName}</span>
              <div className="d-flex justify-content-end align-content-center align-items-center gap-1">
                <i className="mdi mdi-arrow-right font-12" />
                <input
                  type="checkbox"
                  id={`${htmlForSwitchPermiso}_${id}_${permiso}`}
                  checked={activo}
                  onChange={() => handleToggleChange(id)}
                  data-switch="danger"
                />
                <label htmlFor={`${htmlForSwitchPermiso}_${id}_${permiso}`} data-on-label="No" data-off-label="Si" />
              </div>
            </Col>
          ))}
        </Row>
      </Col>

      <Col xs="auto" md={12} className="ms-auto mt-2 pt-1">
        <Button className="shadow-sm" variant="info" onClick={enviarPermisos} disabled={!hasTouched}>
          {' '}
          {isLoadingUpdatePermisosDenegados && <Spinner className="spinner-border-sm" tag="span" color="white" />}
          {!isLoadingUpdatePermisosDenegados && 'Guardar cambios'}
        </Button>
      </Col>
    </Row>
  );
});

export {PermisosDenegados};
