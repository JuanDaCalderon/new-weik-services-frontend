import {memo, useEffect, useMemo, useState} from 'react';
import ReactTable from '@/components/table/ReactTable';
import {columns} from './Columnas';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {EmployeeWithFilterDate} from '@/types';
import {Col, Row} from 'react-bootstrap';
import {CustomDatePicker} from '@/components';

const Balance = memo(function Balance() {
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  const usersWithFilterDate: EmployeeWithFilterDate[] = useMemo(() => {
    return users.map((user) => {
      const thisFilterDate = filterDate.toLocaleDateString('es-ES');
      return {
        ...user,
        filterDate: thisFilterDate
      };
    });
  }, [filterDate, users]);

  return (
    <>
      <Row className="m-0 p-0">
        <Col className="m-0 p-0 d-flex align-items-center">
          <h4 className="header-title text-dark text-opacity-75 mb-0 ms-1">Balance</h4>
        </Col>
        <Col className="d-flex justify-content-end align-items-center m-0 p-0">
          <label className="p-0 my-0 ms-0 me-1">Fecha</label>
          <CustomDatePicker hideAddon={false} value={filterDate} onChange={(date) => setFilterDate(date)} />
        </Col>
      </Row>
      {isLoadingUsers ? (
        <SkeletonLoader height="500px" customClass="p-0 mt-2" />
      ) : (
        <ReactTable<EmployeeWithFilterDate>
          columns={columns}
          data={usersWithFilterDate}
          pageSize={10}
          tableClass="table-striped"
          showPagination
        />
      )}
    </>
  );
});

export {Balance};
