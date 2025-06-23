import {GenericModal, UsersColumnList} from '@/components';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import ReactTable from '@/components/tablev02/ReactTable';
import {useAddObjetivos, useGetObjetivos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {selectisLoadingEmployees, selectIsLoadingObjetivos, selectObjetivos} from '@/store/selectores';
import {Employee, Objetivos as ObjetivosType} from '@/types';
import {checkIfObjetivoExists, DateUtils, filterUsers, getNombreCompletoUser, SessionStorageUtil} from '@/utils';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {columns} from './Columnas';
import {useDatePicker, useTogglev2} from '@/hooks';
import {CrearObjetivo} from './CrearObjetivo';
import toast from 'react-hot-toast';
import {SESSIONSTORAGE_OBJETIVOS_USER_SELECTED_KEY} from '@/constants';

const Objetivos = memo(function Objetivos({users = []}: {users: Employee[]}) {
  const [nuevoObjetivo, setNuevoObjetivo] = useState<Partial<ObjetivosType>>({});
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [usersFiltered, setusersFiltered] = useState<Employee[]>([]);
  const {dateRange, onDateChangeRange} = useDatePicker();
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const objetivos = useAppSelector(selectObjetivos);
  const isLoadingObjetivos = useAppSelector(selectIsLoadingObjetivos);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getObjetivosSync} = useGetObjetivos();
  const {show, isOpen, toggle} = useTogglev2();
  const {addObjetivo, isSavingObjetivo} = useAddObjetivos();

  useEffect(() => {
    if (users.length > 0) {
      setusersFiltered(users);
      const selectedUserId = SessionStorageUtil.getItem<string>(SESSIONSTORAGE_OBJETIVOS_USER_SELECTED_KEY);
      const userFound = users.find((u) => u.id === selectedUserId);
      setSelectedUser(userFound ?? users[0]);
    }
  }, [users]);

  const search = useCallback((text: string) => setusersFiltered(filterUsers(users, text)), [users]);

  const handleUserSelection = (u: Employee) => {
    setSelectedUser(u);
    SessionStorageUtil.setItem(SESSIONSTORAGE_OBJETIVOS_USER_SELECTED_KEY, u.id);
  };

  const onSendObjetivo = useCallback(async () => {
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    if (checkIfObjetivoExists(nuevoObjetivo as ObjetivosType, objetivos)) {
      toast.error('El objetivo no se pudo crear, ya existe un objetivo con el mismo titulo y/o descripción.');
      return;
    }
    if (!selectedUser) {
      toast.error('Por favor selecciona un usuario');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];
    const objetivo: ObjetivosType = {
      ...nuevoObjetivo,
      userId: selectedUser.id,
      rangoFechas: dateRangeFormatted
    } as ObjetivosType;
    await addObjetivo(objetivo);
    toggle();
    await getObjetivosSync();
  }, [addObjetivo, dateRange, getObjetivosSync, nuevoObjetivo, objetivos, selectedUser, toggle]);

  const objetivosPerUser = useMemo(() => {
    if (selectedUser) return objetivos.filter((o) => o.userId === selectedUser.id);
    return [];
  }, [objetivos, selectedUser]);

  return (
    <>
      <Row>
        <Col xl={2}>
          <div className="mt-1">
            <UsersColumnList
              users={usersFiltered}
              isLoadingUsers={isLoadingUsers}
              onUserSelect={handleUserSelection}
              search={search}
              selectedUser={selectedUser}
            />
          </div>
        </Col>
        <Col xl={10}>
          {isLoadingUsers || isLoadingObjetivos ? (
            <SkeletonLoader height="500px" customClass="p-0 mt-2" />
          ) : (
            <>
              <Row className="m-0 p-0">
                <Col className="m-0 p-0 d-flex align-items-center">
                  <h4 className="header-title text-dark text-opacity-75 mb-0">Objetivos</h4>
                </Col>
                <Col className="d-flex justify-content-end align-items-center m-0 p-0">
                  <Button className="shadow-sm" variant="success" onClick={show}>
                    <i className="mdi mdi-crown me-1" /> Crear Objetivo
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col className="pt-2 mt-1">
                  <ReactTable<ObjetivosType>
                    columns={columns}
                    data={objetivosPerUser}
                    pageSize={10}
                    theadClass="table-light"
                    tableClass="objetivos-table"
                    showPagination
                    isSearchable
                  />
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
      <GenericModal
        show={isOpen}
        onToggle={toggle}
        variant="success"
        headerText={`Crear Objetivo de ${selectedUser ? getNombreCompletoUser(selectedUser as Employee) : ''}`}
        secondaryText="Cancelar"
        submitText="Crear Objetivo"
        onSend={onSendObjetivo}
        isDisabled={!hasTouched || isSavingObjetivo}
        isLoading={isSavingObjetivo}
        body={
          <CrearObjetivo
            nuevoObjetivo={nuevoObjetivo}
            setNuevoObjetivo={setNuevoObjetivo}
            setHasTouched={setHasTouched}
            dateRange={dateRange}
            onDateChangeRange={onDateChangeRange}
          />
        }
      />
    </>
  );
});

export {Objetivos};
