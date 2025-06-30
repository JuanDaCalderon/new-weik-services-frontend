import {useAppSelector} from '@/store';
import {selectClientes, selectRegistros, isLoadingClientes} from '@/store/selectores';
import {memo, useCallback, useMemo} from 'react';
import {Card, Table, ProgressBar} from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import {SkeletonLoader} from '../SkeletonLoader';
import {REGISTRO_STATUS} from '@/constants';
import {DateUtils} from '@/utils';

const ClientesRegistros = () => {
  const isLoadingClients = useAppSelector(isLoadingClientes);
  const clientes = useAppSelector(selectClientes);
  const registros = useAppSelector(selectRegistros);

  const todayInfo = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    return {startOfToday, endOfToday};
  }, []);

  const getTiposRegistros = useCallback(
    (cliente: string): string[] => Object.keys(registros[cliente] || {}),
    [registros]
  );

  const getTotalPendings = useCallback(
    (cliente: string, tipoRegistro: string) => {
      const allRegisters = registros?.[cliente]?.[tipoRegistro]?.registros ?? [];
      const registrosValidos = allRegisters.filter((r) => r.estado !== REGISTRO_STATUS.ENTREGADO);
      return registrosValidos.length;
    },
    [registros]
  );

  const getTodayUncompleted = useCallback(
    (cliente: string, tipoRegistro: string) => {
      const {startOfToday, endOfToday} = todayInfo;
      const allRegisters = registros?.[cliente]?.[tipoRegistro]?.registros ?? [];
      const registrosValidos = allRegisters.filter((r) => {
        const inputTime = DateUtils.parseStringToDate(r.deliverAt).getTime();
        if (inputTime >= startOfToday.getTime() && inputTime <= endOfToday.getTime()) {
          return r.estado !== REGISTRO_STATUS.COMPLETADO && r.estado !== REGISTRO_STATUS.ENTREGADO;
        } else return false;
      });
      return registrosValidos.length;
    },
    [registros, todayInfo]
  );

  const getTodayPendings = useCallback(
    (cliente: string, tipoRegistro: string) => {
      const {startOfToday, endOfToday} = todayInfo;
      const allRegisters = registros?.[cliente]?.[tipoRegistro]?.registros ?? [];
      const registrosValidos = allRegisters.filter((r) => {
        const inputTime = DateUtils.parseStringToDate(r.deliverAt).getTime();
        if (inputTime >= startOfToday.getTime() && inputTime <= endOfToday.getTime()) {
          return r.estado !== REGISTRO_STATUS.ENTREGADO;
        } else return false;
      });
      return registrosValidos.length;
    },
    [registros, todayInfo]
  );

  const getTodayRegisters = useCallback(
    (cliente: string, tipoRegistro: string) => {
      const {startOfToday, endOfToday} = todayInfo;
      const allRegisters = registros?.[cliente]?.[tipoRegistro]?.registros ?? [];
      const registrosValidos = allRegisters.filter((r) => {
        const inputTime = DateUtils.parseStringToDate(r.deliverAt).getTime();
        return inputTime >= startOfToday.getTime() && inputTime <= endOfToday.getTime();
      });
      return registrosValidos.length;
    },
    [registros, todayInfo]
  );

  return (
    <Card className="m-0">
      <Card.Header className="d-flex justify-content-between align-items-center pb-1">
        <h4 className="header-title m-0 p-0">Clientes</h4>
      </Card.Header>
      <Card.Body className="pt-0">
        {isLoadingClients ? (
          <SkeletonLoader customClass="p-0" width="100%" height="155px" />
        ) : (
          <SimpleBar style={{maxHeight: '15vh'}}>
            <Table responsive className="table table-sm table-centered mb-0 font-13 dashboard-table">
              <thead className="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Pendientes totales</th>
                  <th>Pendientes para hoy</th>
                  <th style={{width: '36%'}}>Progreso completado para hoy</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nombre}</td>
                    <td>
                      {getTiposRegistros(cliente.domain).map((tipoRegistro, i, array) => {
                        const totalPendings = getTotalPendings(cliente.domain, tipoRegistro);
                        return (
                          <span key={i}>
                            {tipoRegistro}:
                            <span
                              className={`ms-1 me-0 text-${totalPendings === 0 ? 'success' : 'danger'} text-center`}>
                              {totalPendings}
                            </span>
                            {i < array.length - 1 ? ' | ' : ''}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      {getTiposRegistros(cliente.domain).map((tipoRegistro, i, array) => {
                        const totalPendings = getTodayPendings(cliente.domain, tipoRegistro);
                        return (
                          <span key={i}>
                            {tipoRegistro}:
                            <span
                              className={`ms-1 me-0 text-${totalPendings === 0 ? 'success' : 'danger'} text-center`}>
                              {totalPendings}
                            </span>
                            {i < array.length - 1 ? ' | ' : ''}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                        {(() => {
                          const tipos = getTiposRegistros(cliente.domain);
                          let totalHoy = 0;
                          let pendientesHoy = 0;
                          tipos.forEach((tipoRegistro) => {
                            totalHoy += getTodayRegisters(cliente.domain, tipoRegistro);
                            pendientesHoy += getTodayUncompleted(cliente.domain, tipoRegistro);
                          });
                          const porcentaje = totalHoy > 0 ? (pendientesHoy / totalHoy) * 100 : 0;
                          return (
                            <>
                              <ProgressBar className="w-75" animated now={porcentaje} style={{height: '4px'}} />
                              <span className="text-primary ms-4">{`${pendientesHoy}/${totalHoy}`}</span>
                            </>
                          );
                        })()}
                        <span>Completados</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </SimpleBar>
        )}
      </Card.Body>
    </Card>
  );
};

export default memo(ClientesRegistros);
