import {useRolesYPermisos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {permisosSelector, rolesSelector} from '@/store/selectores';
import {PermisoByRoles, thisRol} from '@/types';
import {Row as RowTable} from '@tanstack/react-table';
import {memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import toast from 'react-hot-toast';

const RenderSubComponent = ({row}: {row: RowTable<thisRol>}) => {
  const permisosFromStore = useAppSelector(permisosSelector);
  const rolesFromStore = useAppSelector(rolesSelector);
  const permisosEncontrados = useMemo(() => {
    return rolesFromStore.find((rol) => rol.id === String(row.original.id))?.permisos ?? [];
  }, [rolesFromStore, row.original.id]);
  const permisosIniciales = useMemo(() => {
    return permisosFromStore.map<PermisoByRoles>((permiso) => {
      return {
        ...permiso,
        activo: permisosEncontrados.some((permisoEncontrado) => permisoEncontrado.id === permiso.id)
      };
    });
  }, [permisosEncontrados, permisosFromStore]);
  const htmlForSwitchRole: string = useMemo(() => {
    return `${row.original.rolName}`;
  }, [row.original.rolName]);
  const [thisPermisos, setThisPermisos] = useState<PermisoByRoles[]>(permisosIniciales);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {updatePermisosDeRol} = useRolesYPermisos();

  const handleToggleChange = useCallback((id: string) => {
    setThisPermisos((prevP) =>
      prevP.map((p) => (p.id === id ? {...p, activo: !p.activo} : {...p}))
    );
    setHasTouched(true);
  }, []);

  const enviarPermisos = useCallback(async () => {
    const permisosCambiados = thisPermisos.filter(
      (permiso, i) => permiso.activo !== permisosIniciales[i].activo
    );
    if (permisosCambiados.length > 0) {
      await updatePermisosDeRol(String(row.original.id), permisosCambiados);
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [permisosIniciales, row.original.id, thisPermisos, updatePermisosDeRol]);

  if (!row || !row.original) return null;
  return (
    <Row className="m-0 py-2 row-gap-3 column-gap-1 bg-light-subtle">
      {thisPermisos.map(({id, permiso, labelName, activo}) => (
        <Col
          key={id}
          className="d-flex justify-content-around align-content-center align-items-center"
          xs={3}
          xl={2}
          xxl="auto">
          <span className="me-1">{labelName}</span>
          <input
            type="checkbox"
            id={`${htmlForSwitchRole}_${id}_${permiso}`}
            checked={activo}
            onChange={() => handleToggleChange(id)}
            data-switch="success"
          />
          <label
            htmlFor={`${htmlForSwitchRole}_${id}_${permiso}`}
            data-on-label="Si"
            data-off-label="No"
          />
        </Col>
      ))}
      <Col xs="auto" xl={2} className="ms-auto">
        <Button
          className="w-100 shadow-sm"
          variant="info"
          onClick={enviarPermisos}
          disabled={!hasTouched}>
          {' '}
          Guardar Cambios
        </Button>
      </Col>
    </Row>
  );
};

const MemoizedRenderSubComponent = memo(RenderSubComponent);

export {MemoizedRenderSubComponent};
