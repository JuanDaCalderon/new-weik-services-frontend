import {FileType, PageBreadcrumb, Spinner} from '@/components';
import ReactTable from '@/components/table/ReactTable';
import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {columns} from './Columnas';
import {Cliente} from '@/types';
import {useAppSelector} from '@/store';
import {selectClientes} from '@/store/selectores';
import toast, {Toaster} from 'react-hot-toast';
import {removeTrashFromDomain, DateUtils, DebugUtil} from '@/utils';
import {FileUploader} from '@/components';
import useClientImage from './useClientImage';
import {STORAGE_CLIENTES_PATH} from '@/constants';
import {useGetClients, useUploadImage} from '@/endpoints';
import useAddClient from '@/endpoints/db/clientes/useAddClient';
const clienteDatosIniciales: Cliente = {
  id: '',
  nombre: '',
  domain: '',
  branding: '',
  logo: ''
};

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const CrearCliente = memo(function CrearCliente() {
  const [newCliente, setNewCliente] = useState<Cliente>(clienteDatosIniciales);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {clientImage, handleImageFile, handleImageRemoved} = useClientImage();
  const clientes = useAppSelector(selectClientes);
  const {isLoadingUploadImage, uploadImage} = useUploadImage();
  const {isLoadingAddClient, addClient} = useAddClient();
  const {getClientesSync} = useGetClients();

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setNewCliente((prev) => ({...prev, [name]: value}));
    setHasTouched(true);
  }, []);

  const handleFileUpload = useCallback(
    (file: FileType) => {
      handleImageFile(file);
      setHasTouched(true);
    },
    [handleImageFile]
  );

  const isValidClient = useCallback((clienteData: Cliente): boolean => {
    return (
      !!clienteData &&
      !!clienteData.nombre.trim() &&
      !!clienteData.domain.trim() &&
      !!clienteData.branding.trim()
    );
  }, []);

  const enviarCliente = useCallback(async () => {
    if (isValidClient(newCliente) && clientImage) {
      try {
        const refName = newCliente.nombre.toLowerCase().replace(/\s+/g, '');
        const refDomain = removeTrashFromDomain(
          newCliente.domain.toLowerCase().replace(/\s+/g, '')
        );
        const imgName = `${refName}_${refDomain}_${DateUtils.getDateOnly(new Date(), '_')}`;
        const imgUrl = await uploadImage(STORAGE_CLIENTES_PATH, imgName, clientImage);
        const cliente: Cliente = {
          nombre: newCliente.nombre,
          domain: refDomain,
          branding: newCliente.branding,
          logo: imgUrl
        } as Cliente;
        await addClient(cliente);
        await getClientesSync();
        setNewCliente(clienteDatosIniciales);
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      }
    } else {
      toast.error('Complete todos los campos y asegúrese de haber subido una imagen.');
    }
    setHasTouched(false);
  }, [isValidClient, newCliente, clientImage, uploadImage, addClient, getClientesSync]);

  const isLoadingUploadCliente = useMemo(() => {
    return isLoadingAddClient || isLoadingUploadImage;
  }, [isLoadingAddClient, isLoadingUploadImage]);

  return (
    <>
      <PageBreadcrumb title="Crear cliente" />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={12} lg={4} xl={3} xxl={2} className="mb-3 mb-lg-0">
                  <p className="weik-text-grey-200 my-1">
                    Completa los campos y haz clic en "Crear" para añadir un cliente.
                  </p>
                  <ul>
                    <li>
                      <h5 className="d-inline-block weik-text-grey-300 my-0">
                        Nombre del cliente:
                      </h5>
                      <p className="d-inline-block weik-text-grey-200 ms-1 my-0">
                        Nombre completo del cliente
                      </p>
                    </li>
                    <li>
                      <h5 className="d-inline-block weik-text-grey-300 my-0">
                        Dominio del cliente:
                      </h5>
                      <p className="d-inline-block weik-text-grey-200 ms-1 my-0">
                        @<b>dominio</b>.com, donde se asociarán los correos de los usuarios al
                        cliente. No debe contener espacios.
                      </p>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-center flex-column mb-3">
                    <Form.Label className="mb-0" htmlFor="nombre">
                      <strong>Logo o imagen del cliente:</strong>
                    </Form.Label>
                    <div className="avatar-lg d-block me-auto ms-auto mb-1">
                      <FileUploader
                        onFileUpload={handleFileUpload}
                        onFileRemoved={handleImageRemoved}
                        acceptedFileTypes={ACCEPTED_FILE_TYPES}
                        resetFile={!hasTouched}
                        isRounded
                      />
                    </div>
                  </div>

                  <Form.Label className="mb-0" htmlFor="nombre">
                    <strong>Nombre del cliente:</strong>
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese el nombre del cliente"
                    value={newCliente.nombre}
                    onChange={handleInputChange}
                  />
                  <Form.Label className="mb-0 mt-1" htmlFor="domain">
                    <strong>Dominio del cliente:</strong>
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="domain"
                    name="domain"
                    placeholder="Ingrese el dominio del cliente"
                    value={newCliente.domain}
                    onChange={handleInputChange}
                  />
                  <Form.Label className="mb-0 mt-1" htmlFor="branding">
                    <strong>Link al branding del cliente:</strong>
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="url"
                    id="branding"
                    name="branding"
                    pattern="https://.*"
                    required
                    placeholder="Ingrese la URL del branding del cliente"
                    value={newCliente.branding}
                    onChange={handleInputChange}
                  />
                  <Button
                    disabled={!hasTouched || isLoadingUploadCliente}
                    variant="success"
                    className="w-100 mt-2"
                    onClick={enviarCliente}>
                    {isLoadingUploadCliente && (
                      <Spinner className="spinner-border-sm" tag="span" color="white" />
                    )}
                    {!isLoadingUploadCliente && (
                      <>
                        <i className="mdi mdi-plus-circle me-1" /> Crear
                      </>
                    )}
                  </Button>
                </Col>
                <Col sm={12} lg={8} xl={9} xxl={10}>
                  <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Clientes</h4>

                  <ReactTable<Cliente>
                    columns={columns}
                    data={clientes}
                    pageSize={10}
                    tableClass="table-striped"
                    showPagination
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
});

export {CrearCliente};
