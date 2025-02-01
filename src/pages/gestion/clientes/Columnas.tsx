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
import useProfileImage from '@/pages/perfil/UserPortadaBox/useProfileImage';

const clientesAcciones = memo(function RolNameColumn({row}: {row: Row<Cliente>}) {
  /* EDIT CLIENT */
  const clientes = useAppSelector(selectClientes);
  const clienteDatosIncial: Cliente = useMemo(
    () => clientes.find((c: Cliente) => c.id === row.original.id) as Cliente,
    [clientes, row.original.id]
  );
  const [editClienteOpen, editClienteToggle, showEditCliente, hideEditCliente] = useToggle();
  const [updatedClient, setUpdatedClient] = useState<Cliente>(clienteDatosIncial);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const {
    isProfileImageEdit,
    toggleProfileImageEdit,
    handleImageFile,
    handleImageRemoved,
    profileImage
  } = useProfileImage();
  /* END EDIT CLIENT */
  /* DELETE CLIENT */
  const [isReadyToBeDeleted, setIsReadyToBeDeleted] = useState<boolean>(true);
  const [domain, setDomain] = useState<string>('');
  const [deleteClienteOpen, deleteClienteToggle, showDeleteCliente, hideDeleteCliente] =
    useToggle();
  /* END DELETE CLIENT */
  const {getClientesSync} = useGetClients();
  const {isLoadingDeleteCliente, deleteCliente} = useDeleteClient();
  const {uploadImage, isLoadingUploadImage} = useUploadImage();
  const {deleteImage, isLoadingDeleteImage} = useDeleteImage();
  const {updateClient, isUpdateClient} = useUpdateClient();

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDomain(e.target.value);
      e.target.value === row.original.domain
        ? setIsReadyToBeDeleted(false)
        : setIsReadyToBeDeleted(true);
    },
    [row.original.domain]
  );

  const handleInputChangeEdit = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setUpdatedClient((prev) => ({...prev, [name]: value}));
    setHasTouched(true);
  }, []);

  const onDeleteClient = useCallback(async () => {
    await deleteCliente(row.original.id);
    await getClientesSync();
    setDomain('');
    setIsReadyToBeDeleted(true);
    hideDeleteCliente();
  }, [deleteCliente, getClientesSync, hideDeleteCliente, row.original.id]);

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

  const onEditClient = useCallback(async () => {
    const clienteUpdated = getUpdatedFields<Cliente>(clienteDatosIncial, updatedClient);
    if (Object.keys(clienteUpdated).length > 0 || profileImage) {
      let newImageUrl: string | undefined = undefined;
      let cliente: Cliente;
      if (clienteUpdated.nombre && !isValidName(clienteUpdated.nombre)) {
        toast.error('El nombre no puede contener caracteres especiales.');
        return;
      }
      if (profileImage) {
        const refName = formatText(
          clienteUpdated.nombre ? clienteUpdated.nombre : row.original.nombre
        );
        const refDomain = formatDomain(
          clienteUpdated.domain ? clienteUpdated.domain : row.original.domain
        );
        const imgName = `${refName}_${refDomain}_${DateUtils.getDateOnly(new Date(), '_')}`;
        newImageUrl = await uploadImage(STORAGE_CLIENTES_PATH, imgName, profileImage); // Esta es la url de la nueva imagen
        await deleteImage(row.original.logo); // Eliminamos la imagen anterior
      }
      if (newImageUrl) cliente = {...clienteUpdated, logo: newImageUrl} as Cliente;
      else cliente = {...clienteUpdated} as Cliente;
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
    getClientesSync,
    hideEditCliente,
    profileImage,
    row.original.domain,
    row.original.id,
    row.original.logo,
    row.original.nombre,
    updateClient,
    updatedClient,
    uploadImage
  ]);

  const editModalBody: JSX.Element = useMemo(
    () => (
      <div className="d-flex w-100 flex-column">
        <Form.Label className="mb-0" htmlFor="nombre">
          <strong>Logo o imagen del cliente:</strong>
        </Form.Label>
        <div className="avatar-lg position-relative d-block me-auto ms-auto mb-3">
          {isProfileImageEdit ? (
            <FileUploader
              onFileUpload={(file) => {
                handleImageFile(file);
                setHasTouched(true);
              }}
              onFileRemoved={handleImageRemoved}
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
          {!profileImage && (
            <Button
              variant="light"
              className="btn-icon shadow-none p-0 m-0 position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '100px',
                borderColor: 'transparent'
              }}
              onClick={toggleProfileImageEdit}>
              <i
                className={`mdi ${isProfileImageEdit ? 'mdi-arrow-u-right-bottom-bold' : 'mdi-image-edit'} font-18 d-flex justify-content-center align-items-center`}></i>
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
      handleImageFile,
      handleImageRemoved,
      handleInputChangeEdit,
      isProfileImageEdit,
      profileImage,
      row.original.logo,
      toggleProfileImageEdit,
      updatedClient.branding,
      updatedClient.nombre
    ]
  );

  return (
    <>
      <div className="d-flex gap-1">
        <Button type="button" variant="outline-primary py-0 px-1" onClick={showEditCliente}>
          <i className="uil-pen"></i>
        </Button>
        <Button type="button" variant="outline-danger py-0 px-1" onClick={showDeleteCliente}>
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
