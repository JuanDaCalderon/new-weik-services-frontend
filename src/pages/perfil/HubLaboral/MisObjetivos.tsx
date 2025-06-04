import {useAppSelector} from '@/store';
import {selectIsLoadingObjetivos, selectObjetivos, selectUser} from '@/store/selectores';
import {memo, useEffect, useMemo} from 'react';
import {Row, Col} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {Objetivos} from '@/types';
import {columns} from './Columnas';
import {useGetObjetivos} from '@/endpoints';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const MisObjetivos = memo(function MisObjetivos() {
  const {id} = useAppSelector(selectUser);
  const objetivos = useAppSelector(selectObjetivos);
  const isLoadingObjetivos = useAppSelector(selectIsLoadingObjetivos);
  const {getObjetivosListener} = useGetObjetivos();

  useEffect(() => {
    const unsubscribe = getObjetivosListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getObjetivosListener]);

  const misObjetivo = useMemo(() => {
    if (id) return objetivos.filter((o) => o.userId === id);
    return [];
  }, [id, objetivos]);

  return (
    <>
      <Row className="m-0 pt-2">
        <Col className="p-0">
          <h4 className="header-title text-dark text-opacity-75">Mis Objetivos</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          {isLoadingObjetivos ? (
            <SkeletonLoader height="400px" customClass="p-0" />
          ) : (
            <ReactTable<Objetivos>
              columns={columns}
              data={misObjetivo}
              pageSize={10}
              theadClass="table-light"
              tableClass="objetivos-table"
              showPagination
              isSearchable
            />
          )}
        </Col>
      </Row>
    </>
  );
});

export {MisObjetivos};
