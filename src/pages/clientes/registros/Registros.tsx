import {memo, useCallback, useMemo} from 'react';
import {registrosCrearSchema, RegistrosCrearFormFields} from '@/pages/clientes/registros/schemas/createRegistro';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {useParams} from 'react-router-dom';
import {columns} from './Columnas';
import {REGISTRO_ASSIGNMENT, REGISTRO_PRIORIDAD, REGISTRO_STATUS, RegistrosProps} from '@/types';
import {selectRegistrosByClienteYTipo} from '@/store/selectores';
import {useSelector} from 'react-redux';
import useAddRegistros from '@/endpoints/db/registros/useAddRegistros';
import {useLoadRegistros} from '@/pages/clientes/registros/hooks/useLoadRegistros';
import {LoadRegistros} from '@/pages/clientes/registros/components/LoadRegistros';
import {GenericModal} from '@/components';
import {useTogglev2} from '@/hooks';
import {HookForm, HookInputField, HookSelectField} from '@/components/Form2';
import {DateUtils} from '@/utils';

const Registros = memo(function Registros({registerType}: RegistrosProps) {
  const {cliente} = useParams<{cliente: string}>();
  const {addRegistroPerClienteType, isSavingRegistro} = useAddRegistros();
  const selectRegistros = useMemo(() => {
    if (!cliente) return null;
    return selectRegistrosByClienteYTipo(cliente, registerType);
  }, [cliente, registerType]);
  const {registros, isLoading} = useSelector(selectRegistros || (() => ({registros: [], isLoading: false})));
  const {isOpen, toggle} = useTogglev2();
  const {checkRecords, toggleCheck, refreashRegistros} = useLoadRegistros(cliente, registerType, registros.length);

  const prioridadLabels = {
    [REGISTRO_PRIORIDAD.BAJA]: 'Baja',
    [REGISTRO_PRIORIDAD.MEDIA]: 'Media',
    [REGISTRO_PRIORIDAD.ALTA]: 'Alta',
    [REGISTRO_PRIORIDAD.SINPRIORIDAD]: 'Sin Prioridad'
  };

  const estadoLabels = {
    [REGISTRO_STATUS.ENPROGRESO]: 'En Progreso',
    [REGISTRO_STATUS.PAUSA]: 'En Pausa',
    [REGISTRO_STATUS.ENTREGADO]: 'Entregado',
    [REGISTRO_STATUS.COMPLETADO]: 'Completado'
  };

  const addRegistro = useCallback(
    async (registro: RegistrosCrearFormFields) => {
      if (!cliente) return;
      await addRegistroPerClienteType(cliente, registerType, {
        cliente: registro.cliente,
        nombre: registro.nombre,
        link: registro.link,
        solicitante: registro.solicitante,
        encargado: registro.encargado || REGISTRO_ASSIGNMENT.SINASIGNAR,
        numeroOrden: registro.numeroOrden,
        estado: registro.estado || REGISTRO_STATUS.PAUSA,
        prioridad: registro.prioridad || REGISTRO_PRIORIDAD.SINPRIORIDAD,
        requestAt: DateUtils.parseDate(registro.requestAt),
        deliverAt: DateUtils.parseDatetimeLocal(registro.deliverAt),
        tags: [],
        comentarios: registro.comentarios
          ? [
              {
                comentario: registro.comentarios,
                createdAt: new Date()
              }
            ]
          : []
      });
      toggle();
    },
    [addRegistroPerClienteType, cliente, registerType, toggle]
  );

  return (
    <Row>
      <Col className="d-flex align-content-center align-items-center justify-content-between py-1" xs={12}>
        <LoadRegistros checkRecords={checkRecords} onToggleCheck={toggleCheck} isLoading={isLoading} />
        <div className="d-flex align-items-center gap-1">
          <Button className="font-14 px-2" variant="outline-success" onClick={toggle}>
            Agregar
          </Button>
          <GenericModal
            show={isOpen}
            onToggle={toggle}
            showFooter={false}
            variant="success"
            headerText={`Agregar registro a ${cliente} - ${registerType}`}
            body={
              <HookForm<RegistrosCrearFormFields>
                schema={registrosCrearSchema}
                onSubmit={addRegistro}
                isDisabled={isSavingRegistro}
                isLoading={isSavingRegistro}>
                <HookInputField
                  xs={12}
                  md={6}
                  name="requestAt"
                  label="Fecha de solicitud"
                  type="date"
                  bottomMargin={1}
                />
                <HookInputField
                  xs={12}
                  md={6}
                  name="deliverAt"
                  label="Fecha de entrega"
                  type="datetime-local"
                  bottomMargin={1}
                />
                <HookInputField xs={12} name="nombre" label="Nombre del proyecto" type="text" bottomMargin={1} />
                <HookInputField xs={12} name="cliente" label="Cliente" type="text" bottomMargin={1} />
                <HookInputField xs={12} name="solicitante" label="Solicitante" type="text" bottomMargin={1} />
                <HookInputField
                  xs={12}
                  name="numeroOrden"
                  label="Número de orden o de factura"
                  type="text"
                  bottomMargin={1}
                />
                <HookInputField xs={12} name="link" label="Link" type="url" bottomMargin={1} />
                <HookSelectField
                  xs={12}
                  md={6}
                  name="prioridad"
                  label="Prioridad"
                  bottomMargin={1}
                  options={Object.values(REGISTRO_PRIORIDAD).map((p) => ({value: p, label: prioridadLabels[p]}))}
                />
                <HookSelectField
                  xs={12}
                  md={6}
                  name="estado"
                  label="Estado"
                  bottomMargin={1}
                  options={Object.values(REGISTRO_STATUS).map((p) => ({value: p, label: estadoLabels[p]}))}
                />
                <HookSelectField
                  xs={12}
                  name="encargado"
                  label="Encargado"
                  bottomMargin={1}
                  options={[{value: REGISTRO_ASSIGNMENT.SINASIGNAR, label: 'Sin Asignar'}]}
                />
                <HookInputField
                  xs={12}
                  name="comentarios"
                  label="Comentarios u observaciones"
                  as="textarea"
                  rows={3}
                  bottomMargin={1}
                />
              </HookForm>
            }
          />
          <Button
            className="font-14 px-2"
            variant="outline-danger"
            onClick={() => console.log('Eliminar registros seleccionados')}>
            Eliminar
          </Button>
          <Button disabled={isLoading} className="font-14 px-2" variant="outline-primary" onClick={refreashRegistros}>
            <i className="mdi mdi-autorenew" />
          </Button>
        </div>
      </Col>
      <Col xs={12}>
        <ReactTable<any>
          columns={columns}
          data={[]}
          pageSize={10}
          tableClass="table-striped"
          showPagination
          isExpandable
          isSearchable
          isSelectable
        />
      </Col>
    </Row>
  );
});

export {Registros};
