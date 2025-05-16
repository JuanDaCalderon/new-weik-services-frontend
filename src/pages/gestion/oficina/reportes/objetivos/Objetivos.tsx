import {UsersColumnList} from '@/components';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import ReactTable from '@/components/tablev02/ReactTable';
import {useGetObjetivos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {selectisLoadingEmployees, selectIsLoadingObjetivos, selectObjetivos} from '@/store/selectores';
import {Employee} from '@/types';
import {filterUsers} from '@/utils';
import {memo, useCallback, useEffect, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';

const Objetivos = memo(function Objetivos({users = []}: {users: Employee[]}) {
  const [usersFiltered, setusersFiltered] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const objetivos = useAppSelector(selectObjetivos);
  const isLoadingObjetivos = useAppSelector(selectIsLoadingObjetivos);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getObjetivosSync} = useGetObjetivos();

  useEffect(() => {
    if (objetivos.length <= 0) getObjetivosSync();
  }, [getObjetivosSync, objetivos.length]);

  useEffect(() => {
    if (users.length > 0) {
      setusersFiltered(users);
      setSelectedUser(users[0]);
    }
  }, [users]);

  const search = useCallback((text: string) => setusersFiltered(filterUsers(users, text)), [users]);
  const handleUserSelection = (u: Employee) => setSelectedUser(u);

  return (
    <Card className="m-0 p-0">
      <Card.Body className="m-0 p-1">
        <Row>
          <Col xl={2}>
            <UsersColumnList
              users={usersFiltered}
              isLoadingUsers={isLoadingUsers}
              onUserSelect={handleUserSelection}
              search={search}
              selectedUser={selectedUser}
            />
          </Col>
          <Col xl={10}>
            {isLoadingUsers || isLoadingObjetivos ? (
              <SkeletonLoader height="500px" customClass="p-0 mt-2" />
            ) : (
              <>
                <h4 className="header-title text-dark text-opacity-75 m-0">Objetivos</h4>
                <div className="pt-2 mt-1">
                  <ReactTable<any>
                    columns={[]}
                    data={[]}
                    pageSize={10}
                    tableClass="table-striped"
                    showPagination
                    isSearchable
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
});

export {Objetivos};
