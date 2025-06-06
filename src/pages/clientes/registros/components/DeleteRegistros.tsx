import {memo} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {GenericModal} from '@/components';
import {useTogglev2} from '@/hooks';
import {useDeleteRegistros} from '@/pages/clientes/registros/hooks/useDeleteRegistros';
import {useAppSelector} from '@/store';
import {selectSelectedRows} from '@/store/selectores/selected-row';
import ReactTable from '@/components/tablev02/ReactTable';
import {SelectedRowType} from '@/types';

type Props = {
  cliente: string | undefined;
  registerType: string;
};
const DeleteRegistros = memo(function DeleteRegistros({cliente, registerType}: Props) {
  const selectedRegistros = useAppSelector(selectSelectedRows);
  const {isOpen, toggle} = useTogglev2();
  const {onDeleteRegistro, isDeletingRegistro} = useDeleteRegistros(cliente, registerType);
  return (
    <>
      <Button
        className="font-14 px-2"
        variant="outline-danger"
        onClick={toggle}
        disabled={selectedRegistros.length === 0}>
        <span className="d-none d-md-inline">Eliminar</span>
        <i className="d-inline d-md-none mdi mdi-delete-outline" />
      </Button>
      <GenericModal
        show={isOpen}
        onToggle={toggle}
        variant="danger"
        showDeleteButton
        showSendButton={false}
        headerText={`Eliminar registro a ${cliente} - ${registerType}`}
        onDelete={async () => {
          await onDeleteRegistro(selectedRegistros);
          toggle();
        }}
        isDisabled={isDeletingRegistro}
        isLoading={isDeletingRegistro}
        body={
          <Row>
            <Col xs={12}>
              <ReactTable<SelectedRowType>
                columns={[
                  {
                    header: 'Nombre de los registros a eliminar',
                    accessorKey: 'nombre',
                    cell: ({row}) => row.original.nombre || `Sin nombre - ${row.original.id}`
                  }
                ]}
                data={selectedRegistros}
                theadClass="table-light"
                showPagination
              />
            </Col>
            <Col xs={12} className="d-flex justify-content-center mt-3">
              <p className="m-0 p-0 text-danger">¿Estás seguro que quieres eliminar estos registros?</p>
            </Col>
          </Row>
        }
      />
    </>
  );
});

export {DeleteRegistros};
