import {UsersColumnList} from '@/components';
import {useGetEmployees} from '@/endpoints';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees} from '@/store/selectores';
import {Employee} from '@/types';
import {filterUsers} from '@/utils';
import {memo, useCallback, useEffect, useState} from 'react';
import {Card, Col, Row} from 'react-bootstrap';

const Objetivos = memo(function Objetivos() {
  const [usersFiltered, setusersFiltered] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

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
          <Col xl={10}>objetivos</Col>
        </Row>
      </Card.Body>
    </Card>
  );
});

export {Objetivos};
