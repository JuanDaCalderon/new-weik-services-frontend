import {Cliente} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useCallback, useMemo, JSX, useState, ChangeEvent} from 'react';
import {Button, Form} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {
  useDeleteClient,
  useDeleteImage,
  useGetClients,
  useUpdateClient,
  useUploadImage
} from '@/endpoints';
import {useAppSelector} from '@/store';
import {selectClientes} from '@/store/selectores';
import {DateUtils, formatDomain, formatText, getUpdatedFields, isValidName} from '@/utils';
import toast from 'react-hot-toast';
import {FileUploader} from '@/components';
import {ACCEPTED_FILE_TYPES, STORAGE_CLIENTES_PATH} from '@/constants';
import {useFileManager} from '@/hooks';

const clientesAcciones = memo(function RolNameColumn({row}: {row: Row<Cliente>}) {
  const clientes = useAppSelector(selectClientes);
  const clienteDatosIncial = useMemo(
    () => clientes.find((c) => c.id === row.original.id) as Cliente,
    [clientes, row.original.id]
  );
  const [updatedClient, setUpdatedClient] = useState<Cliente>(clienteDatosIncial);
  const [isReadyToBeDeleted, setIsReadyToBeDeleted] = useState<boolean>(true);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [domain, setDomain] = useState<string>('');

  const [editClienteOpen, editClienteToggle, showEditCliente, hideEditCliente] = useToggle();
  const [deleteClienteOpen, deleteClienteToggle, showDeleteCliente, hideDeleteCliente] =
    useToggle();
  const {file, isFileManagerEdit, toggleFileManagerEdit, handleFileRemoved, handleFile} =
    useFileManager();

  const {getClientesSync} = useGetClients();
  const {isLoadingDeleteCliente, deleteCliente} = useDeleteClient();
  const {uploadImage, isLoadingUploadImage} = useUploadImage();
  const {deleteImage, isLoadingDeleteImage} = useDeleteImage();
  const {updateClient, isUpdateClient} = useUpdateClient();

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDomain(e.target.value);
      setIsReadyToBeDeleted(e.target.value !== row.original.domain);
    },
    [row.original.domain]
  );

  const handleInputChangeEdit = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedClient((prev) => ({...prev, [e.target.name]: e.target.value}));
    setHasTouched(true);
  }, []);

  const onDeleteClient = useCallback(async () => {
    await deleteCliente(row.original.id);
    await getClientesSync();
    setDomain('');
    setIsReadyToBeDeleted(true);
    hideDeleteCliente();
  }, [deleteCliente, getClientesSync, hideDeleteCliente, row.original.id]);

  const onEditClient = useCallback(async () => {
    const clienteUpdated = getUpdatedFields<Cliente>(clienteDatosIncial, updatedClient);
    if (Object.keys(clienteUpdated).length > 0 || file) {
      let newImageUrl: string | undefined = undefined;
      if (clienteUpdated.nombre && !isValidName(clienteUpdated.nombre)) {
        toast.error('El nombre no puede contener caracteres especiales.');
        return;
      }
      if (file) {
        await deleteImage(row.original.logo);
        const refName = formatText(
          clienteUpdated.nombre ? clienteUpdated.nombre : row.original.nombre
        );
        const refDomain = formatDomain(row.original.domain);
        const imgName = `${refName}_${refDomain}_${DateUtils.getDateOnly(new Date(), '_')}`;
        newImageUrl = await uploadImage(STORAGE_CLIENTES_PATH, imgName, file);
      }
      const cliente = newImageUrl ? {...clienteUpdated, logo: newImageUrl} : {...clienteUpdated};
      await updateClient(row.original.id, cliente);
      hideEditCliente();
      await getClientesSync();
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [
    clienteDatosIncial,
    deleteImage,
    file,
    getClientesSync,
    hideEditCliente,
    row.original.domain,
    row.original.id,
    row.original.logo,
    row.original.nombre,
    updateClient,
    updatedClient,
    uploadImage
  ]);

  const deleteModalBody: JSX.Element = useMemo(
    () => (
      <>
        <div className="d-flex w-100 justify-content-around align-items-center gap-1 mb-1">
          <img
            src={row.original.logo}
            alt={row.original.logo}
            loading="lazy"
            width={100}
            height={100}
            className="img rounded-circle object-fit-contain d-block"
          />
          <div className="w-75">
            <p className="p-0 m-0">
              Esta seguro que quiere eliminar el cliente con el nombre: <b>{row.original.nombre}</b>
              .
            </p>
            <p className="p-0 m-0 text-danger">
              Eliminar el cliente implica la eliminación de todos los registros y datos asociados a
              este.
            </p>
          </div>
        </div>
        <Form.Label className="text-danger cursor-pointer mb-0" htmlFor="domain">
          <strong>Ingrese el dominio del cliente para eliminarlo:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          id="domain"
          name="domain"
          placeholder="Ingrese el dominio del cliente"
          value={domain}
          onChange={handleInputChange}
        />
      </>
    ),
    [domain, handleInputChange, row.original.logo, row.original.nombre]
  );

  const editModalBody: JSX.Element = useMemo(
    () => (
      <div className="d-flex w-100 flex-column">
        <Form.Label className="mb-0" htmlFor="nombre">
          <strong>Logo o imagen del cliente:</strong>
        </Form.Label>
        <div className="avatar-lg position-relative d-block me-auto ms-auto mb-3">
          {isFileManagerEdit ? (
            <FileUploader
              onFileUpload={(file) => {
                handleFile(file);
                setHasTouched(true);
              }}
              onFileRemoved={handleFileRemoved}
              acceptedFileTypes={ACCEPTED_FILE_TYPES}
              isRounded
            />
          ) : (
            <img
              src={row.original.logo}
              width="100%"
              height="100%"
              alt="Profile image"
              className="img rounded-circle object-fit-cover w-100 h-100"
              loading="lazy"
            />
          )}
          {!file && (
            <Button
              variant="light"
              className="btn-icon shadow-none p-0 m-0 position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '100px',
                borderColor: 'transparent'
              }}
              onClick={toggleFileManagerEdit}>
              <i
                className={`mdi ${isFileManagerEdit ? 'mdi-arrow-u-right-bottom-bold' : 'mdi-image-edit'} font-18 d-flex justify-content-center align-items-center`}></i>
            </Button>
          )}
        </div>
        <Form.Label className="cursor-pointer mb-0" htmlFor="nombre">
          <strong>Nombre del cliente:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Nombre del cliente"
          value={updatedClient.nombre}
          onChange={handleInputChangeEdit}
        />
        <Form.Label className="cursor-pointer mt-1 mb-0" htmlFor="branding">
          <strong>Link al branding del cliente:</strong>
        </Form.Label>
        <Form.Control
          size="sm"
          type="text"
          id="branding"
          name="branding"
          placeholder="Branding del cliente"
          value={updatedClient.branding}
          onChange={handleInputChangeEdit}
        />
      </div>
    ),
    [
      file,
      handleFile,
      handleFileRemoved,
      handleInputChangeEdit,
      isFileManagerEdit,
      row.original.logo,
      toggleFileManagerEdit,
      updatedClient.branding,
      updatedClient.nombre
    ]
  );

  return (
    <>
      <div className="d-flex gap-1">
        <Button variant="outline-primary py-0 px-1" onClick={showEditCliente}>
          <i className="uil-pen"></i>
        </Button>
        <Button variant="outline-danger py-0 px-1" onClick={showDeleteCliente}>
          <i className="uil-trash"></i>
        </Button>
      </div>
      <GenericModal
        show={deleteClienteOpen}
        onToggle={deleteClienteToggle}
        variant="danger"
        headerText={`Eliminar cliente ${row.original.domain}`}
        submitText="Eliminar"
        secondaryText="Cancelar"
        body={deleteModalBody}
        isDisabled={isLoadingDeleteCliente || isReadyToBeDeleted}
        isLoading={isLoadingDeleteCliente}
        onSend={onDeleteClient}
      />
      <GenericModal
        show={editClienteOpen}
        onToggle={editClienteToggle}
        variant="info"
        headerText={`Editar cliente ${row.original.domain}`}
        submitText="Editar"
        secondaryText="Cancelar"
        body={editModalBody}
        isDisabled={!hasTouched || isUpdateClient || isLoadingUploadImage || isLoadingDeleteImage}
        isLoading={isUpdateClient || isLoadingUploadImage || isLoadingDeleteImage}
        onSend={onEditClient}
      />
    </>
  );
});

const columns: ColumnDef<Cliente>[] = [
  {
    header: 'Cliente',
    accessorKey: 'nombre',
    cell: ({row}) => (
      <div className="table-user">
        <img
          src={row.original.logo}
          alt={row.original.logo}
          loading="lazy"
          className="me-2 rounded-circle object-fit-contain"
        />
        <span className="fw-bold text-dark text-opacity-75">{row.original.nombre}</span>
      </div>
    )
  },
  {
    header: 'Dominio',
    accessorKey: 'domain'
  },
  {
    header: 'Link de branding',
    accessorKey: 'branding',
    cell: ({row}) => (
      <a
        className="link-opacity-100-hover"
        href={row.original.branding}
        target="_blank"
        rel="noreferrer">
        Ir al link
      </a>
    )
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: clientesAcciones
  }
];

export {columns};
