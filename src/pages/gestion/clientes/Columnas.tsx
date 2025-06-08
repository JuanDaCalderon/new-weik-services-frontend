import {Cliente, CustomFieldDefinition, TipoRegistro} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useCallback, useMemo, JSX, useState, ChangeEvent, Fragment} from 'react';
import {Button, Col, Form, OverlayTrigger, Tooltip, Card, Row as BTRow} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {useDeleteClient, useDeleteFile, useGetClients, useUpdateClient, useUploadFiles} from '@/endpoints';
import {useAppSelector} from '@/store';
import {selectClientes, selectUser} from '@/store/selectores';
import {
  DateUtils,
  DebugUtil,
  formatDomain,
  formatText,
  getUpdatedFields,
  hasPermission,
  isValidName,
  normalizarTexto,
  removeUndefined
} from '@/utils';
import toast from 'react-hot-toast';
import {FileUploader} from '@/components';
import {
  ACCEPTED_DOC_TYPES,
  ACCEPTED_FILE_TYPES,
  CUSTOM_FIELD_TYPE,
  PERMISOS_MAP_IDS,
  STORAGE_DOCS_CLIENTES_PATH,
  STORAGE_LOGOS_CLIENTES_PATH
} from '@/constants';
import {useFileManager} from '@/hooks';
import {FormWrapper, InputField} from '@/components/Form2';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const clienteNombre = memo(function ClienteNombreColumn({row}: {row: Row<Cliente>}) {
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  return (
    <div className="d-flex align-items-center table-user ribbon-box">
      {DateUtils.isToday(DateUtils.parseStringToDate(row.original.fechaCreacion)) && (
        <div
          className="ribbon-two ribbon-two-success end-0"
          style={{left: '56%', top: '-11px', height: '98px', width: '134px'}}>
          <span className="font-12" style={{left: '-24px', top: '38px', width: '180px'}}>
            Nuevo
          </span>
        </div>
      )}
      <div className="position-relative">
        {!iconHasLoad && <SkeletonLoader customClass="position-absolute p-0" />}
        <img
          src={row.original.logo}
          alt={row.original.logo}
          loading="lazy"
          className="rounded-circle object-fit-contain"
          onLoad={() => setIconHasLoad(true)}
        />
      </div>
      <div className="d-flex flex-column ms-1">
        <span className="fw-bold text-dark text-opacity-75">{row.original.nombre}</span>
        <span className="m-0 lh-sm d-inline">
          <span className="fw-bold">ID:</span> {row.original.idNitCliente || 'no ID'}
        </span>
        <span className="m-0 lh-sm d-inline">
          <span className="fw-bold">Dirección:</span> {row.original.direccionFisicaCliente || 'No Dirección'}
        </span>
        <span className="m-0 lh-sm d-inline">
          <span className="fw-bold">Teléfono:</span> {row.original.telefonoCliente || 'No Teléfono'}
        </span>
      </div>
    </div>
  );
});

const optionsTypeLabels = {
  [CUSTOM_FIELD_TYPE.STRING]: 'Texto',
  [CUSTOM_FIELD_TYPE.NUMBER]: 'Número',
  [CUSTOM_FIELD_TYPE.BOOLEAN]: 'Booleano (Si/No)',
  [CUSTOM_FIELD_TYPE.SELECT]: 'Selección'
};

const clientesAcciones = memo(function RolNameColumn({row}: {row: Row<Cliente>}) {
  const user = useAppSelector(selectUser);
  const clientes = useAppSelector(selectClientes);
  const clienteDatosIncial = useMemo(
    () => clientes.find((c: Cliente) => c.id === row.original.id) as Cliente,
    [clientes, row.original.id]
  );
  const [tiposRegistros, setTiposRegistros] = useState<TipoRegistro[]>(clienteDatosIncial.tiposRegistros || []);
  const [updatedClient, setUpdatedClient] = useState<Cliente>(clienteDatosIncial);
  const [isReadyToBeDeleted, setIsReadyToBeDeleted] = useState<boolean>(true);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [domain, setDomain] = useState<string>('');

  const [editClienteOpen, editClienteToggle, showEditCliente, hideEditCliente] = useToggle();
  const [gestionarTiposOpen, gestionarTiposToggle, showGestionarTipos, hideGestionarTipos] = useToggle();
  const [deleteClienteOpen, deleteClienteToggle, showDeleteCliente, hideDeleteCliente] = useToggle();

  const {
    file: logo,
    isFileManagerEdit: isLogoManagerEdit,
    toggleFileManagerEdit: toggleLogoManagerEdit,
    handleFileRemoved: handleLogoRemoved,
    handleFile: handleLogo
  } = useFileManager();
  const {file, isFileManagerEdit, toggleFileManagerEdit, handleFileRemoved, handleFile} = useFileManager();
  const {getClientesSync} = useGetClients();
  const {isLoadingDeleteCliente, deleteCliente} = useDeleteClient();
  const {uploadFile, isLoadingUploadFile} = useUploadFiles();
  const {deleteFile, isLoadingDeleteFile} = useDeleteFile();
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
    if (Object.keys(clienteUpdated).length > 0 || logo || file) {
      let newImageUrl: string | undefined = undefined;
      let newDocUrl: string | undefined = undefined;
      if (clienteUpdated.nombre && !isValidName(clienteUpdated.nombre)) {
        toast.error('El nombre no puede contener caracteres especiales.');
        return;
      }
      if (logo && row.original.logo) {
        await deleteFile(row.original.logo);
        const refName = formatText(clienteUpdated.nombre ? clienteUpdated.nombre : row.original.nombre);
        const refDomain = formatDomain(row.original.domain);
        const imgName = `${refName}_${refDomain}_${DateUtils.getDateOnly(new Date(), '_')}`;
        newImageUrl = await uploadFile(STORAGE_LOGOS_CLIENTES_PATH, imgName, logo);
      }
      if (file && row.original.documento) {
        await deleteFile(row.original.documento);
        const refName = formatText(clienteUpdated.nombre ? clienteUpdated.nombre : row.original.nombre);
        const refDomain = formatDomain(row.original.domain);
        const docName = `${refName}_${refDomain}_${DateUtils.getDateOnly(new Date(), '_')}`;
        newDocUrl = await uploadFile(STORAGE_DOCS_CLIENTES_PATH, docName, file);
      }
      const cliente = {
        ...clienteUpdated,
        ...(newImageUrl ? {logo: newImageUrl} : {}),
        ...(newDocUrl ? {documento: newDocUrl} : {})
      };
      await updateClient(row.original.id, cliente);
      hideEditCliente();
      await getClientesSync();
    } else {
      toast.error('No se han realizado cambios');
      setHasTouched(false);
    }
  }, [
    clienteDatosIncial,
    deleteFile,
    file,
    getClientesSync,
    hideEditCliente,
    logo,
    row.original.documento,
    row.original.domain,
    row.original.id,
    row.original.logo,
    row.original.nombre,
    updateClient,
    updatedClient,
    uploadFile
  ]);

  const onGestionarTipos = useCallback(async () => {
    if (clienteDatosIncial.tiposRegistros.length === 0 && tiposRegistros.length === 0) {
      toast.error('Debe agregar al menos un tipo de registro.');
      return;
    }
    try {
      const tiposNormalizados = tiposRegistros.map((r) => normalizarTexto(r.tipo));
      const tiposSet = new Set(tiposNormalizados);
      if (tiposSet.size !== tiposNormalizados.length) {
        toast.error('Hay tipos de registro duplicados. Asegúrate de que cada tipo sea único.');
        return;
      }
      const tiposRegistrosNormalizados = tiposRegistros.map((registro) => {
        const tipo = normalizarTexto(registro.tipo);
        if (!tipo.trim()) {
          toast.error('El nombre del tipo de registro no puede estar vacío.');
          throw new Error('Tipo de registro vacío.');
        }

        const customFields = registro.customFields.map((field) => {
          const key = normalizarTexto(field.key).trim();
          if (!key) {
            toast.error(`Hay un campo personalizado sin nombre en el tipo "${registro.tipo}".`);
            throw new Error('Campo personalizado sin key.');
          }

          let options: string[] | undefined = undefined;

          if (field.type === CUSTOM_FIELD_TYPE.SELECT) {
            if (!field.options || field.options.length === 0) {
              toast.error(`El campo "${field.key}" del tipo "${registro.tipo}" debe tener al menos una opción.`);
              throw new Error('Campo select sin opciones.');
            }

            const opcionesNormalizadas = field.options.map((o) => normalizarTexto(o).trim()).filter(Boolean);
            const opcionesUnicas = Array.from(new Set(opcionesNormalizadas));

            if (opcionesUnicas.length !== opcionesNormalizadas.length) {
              toast.error(`El campo "${field.key}" del tipo "${registro.tipo}" tiene opciones duplicadas.`);
              throw new Error('Opciones duplicadas en campo select.');
            }

            if (opcionesUnicas.length === 0) {
              toast.error(`El campo "${field.key}" del tipo "${registro.tipo}" tiene todas las opciones vacías.`);
              throw new Error('Opciones vacías en campo select.');
            }

            options = opcionesUnicas;
          }

          return {
            ...field,
            key,
            options
          };
        });

        const keysNormalizadas = customFields.map((f) => f.key);
        const keysSet = new Set(keysNormalizadas);
        if (keysSet.size !== keysNormalizadas.length) {
          toast.error(
            `Hay campos personalizados duplicados en el tipo de registro "${registro.tipo}". Asegúrate de que cada campo tenga un nombre único.`
          );
          throw new Error('Campos personalizados duplicados.');
        }

        return {
          ...registro,
          tipo,
          customFields
        };
      });
      const cliente: Partial<Cliente> = {
        tiposRegistros: removeUndefined(tiposRegistrosNormalizados)
      };
      await updateClient(row.original.id, cliente);
      hideGestionarTipos();
      await getClientesSync();
    } catch (error: any) {
      DebugUtil.logError('Error al gestionar tipos de registros', error);
      return;
    }
  }, [
    clienteDatosIncial.tiposRegistros.length,
    getClientesSync,
    hideGestionarTipos,
    row.original.id,
    tiposRegistros,
    updateClient
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
              Esta seguro que quiere eliminar el cliente con el nombre: <b>{row.original.nombre}</b>.
            </p>
          </div>
        </div>
        <InputField
          label="Ingrese el dominio del cliente para eliminarlo"
          placeholder="Ingrese el dominio del cliente"
          name="domain"
          type="text"
          error="Eliminar el cliente implica la eliminación de todos los registros y datos asociados a este."
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
        <div className="row">
          <Col xs={12} md={6}>
            <Form.Label>
              <strong>Logo o imagen del cliente</strong>
            </Form.Label>
            <div className="avatar-lg position-relative d-block me-auto ms-auto mb-3">
              {isLogoManagerEdit ? (
                <FileUploader
                  onFileUpload={(logo) => {
                    handleLogo(logo);
                    setHasTouched(true);
                  }}
                  onFileRemoved={handleLogoRemoved}
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
              {!logo && (
                <Button
                  variant="light"
                  className="btn-icon shadow-none p-0 m-0 position-absolute top-0 end-0 d-flex justify-content-center align-items-center"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '100px',
                    borderColor: 'transparent'
                  }}
                  onClick={toggleLogoManagerEdit}>
                  <i
                    className={`mdi ${isLogoManagerEdit ? 'mdi-arrow-u-right-bottom-bold' : 'mdi-image-edit'} font-18 d-flex justify-content-center align-items-center`}></i>
                </Button>
              )}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <Form.Label>
              <strong>Documento del cliente</strong>
            </Form.Label>
            <div className="avatar-lg position-relative d-block me-auto ms-auto mb-3">
              {isFileManagerEdit ? (
                <FileUploader
                  onFileUpload={(file) => {
                    handleFile(file);
                    setHasTouched(true);
                  }}
                  onFileRemoved={handleFileRemoved}
                  acceptedFileTypes={ACCEPTED_DOC_TYPES}
                  isSquarePreview
                />
              ) : (
                <div className="img-thumbnail d-flex justify-content-center align-content-center w-100 h-100">
                  {row.original.documento ? (
                    <a
                      href={row.original.documento}
                      target="_blank"
                      className="mt-3 mb-0 font-14 lh-1 text-center"
                      rel="noreferrer">
                      ir al documento
                    </a>
                  ) : (
                    <p className="mt-3 mb-0 font-14 lh-1 text-center">Sin documento</p>
                  )}
                </div>
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
          </Col>
        </div>

        <FormWrapper showSubmitButton={false}>
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="Nombre del cliente"
            name="nombre"
            type="text"
            value={updatedClient.nombre}
            onChange={handleInputChangeEdit}
          />
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="Link del cliente"
            name="branding"
            type="url"
            value={updatedClient.branding}
            onChange={handleInputChangeEdit}
          />
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="Persona de contacto"
            type="text"
            name="nombrePersonaContacto"
            value={updatedClient.nombrePersonaContacto}
            onChange={handleInputChangeEdit}
          />
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="Email de la persona de contacto"
            type="email"
            name="emailPersonaContacto"
            value={updatedClient.emailPersonaContacto}
            onChange={handleInputChangeEdit}
          />
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="Teléfono de la persona de contacto"
            type="tel"
            name="telefonoPersonaContacto"
            value={updatedClient.telefonoPersonaContacto}
            onChange={handleInputChangeEdit}
          />
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="ID NIT del cliente"
            type="text"
            name="idNitCliente"
            value={updatedClient.idNitCliente}
            onChange={handleInputChangeEdit}
          />
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="Dirección del cliente"
            type="text"
            name="direccionFisicaCliente"
            value={updatedClient.direccionFisicaCliente}
            onChange={handleInputChangeEdit}
          />
          <InputField
            xs={12}
            sm={6}
            md={4}
            label="Teléfono del cliente"
            type="tel"
            name="telefonoCliente"
            value={updatedClient.telefonoCliente}
            onChange={handleInputChangeEdit}
          />
        </FormWrapper>
      </div>
    ),
    [
      file,
      handleFile,
      handleFileRemoved,
      handleInputChangeEdit,
      handleLogo,
      handleLogoRemoved,
      isFileManagerEdit,
      isLogoManagerEdit,
      logo,
      row.original.documento,
      row.original.logo,
      toggleFileManagerEdit,
      toggleLogoManagerEdit,
      updatedClient.branding,
      updatedClient.direccionFisicaCliente,
      updatedClient.emailPersonaContacto,
      updatedClient.idNitCliente,
      updatedClient.nombre,
      updatedClient.nombrePersonaContacto,
      updatedClient.telefonoCliente,
      updatedClient.telefonoPersonaContacto
    ]
  );

  const agregarTipoRegistro = useCallback(() => {
    setTiposRegistros((prev) => [...prev, {tipo: '', customFields: []}]);
  }, []);

  const eliminarTipoRegistro = useCallback((index: number) => {
    setTiposRegistros((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const actualizarTipoRegistro = useCallback((index: number, value: string) => {
    setTiposRegistros((prev) => {
      return prev.map((registro, idx) => {
        if (idx === index) {
          return {
            ...registro,
            tipo: value
          };
        }
        return registro;
      });
    });
  }, []);

  const agregarCustomField = useCallback((registroIndex: number) => {
    setTiposRegistros((prev) => {
      return prev.map((registro, idx) => {
        if (idx === registroIndex) {
          return {
            ...registro,
            customFields: [...registro.customFields, {key: '', type: CUSTOM_FIELD_TYPE.STRING}]
          };
        }
        return registro;
      });
    });
  }, []);

  const eliminarCustomField = useCallback((registroIndex: number, fieldIndex: number) => {
    setTiposRegistros((prev) =>
      prev.map((registro, rIndex) => {
        if (rIndex !== registroIndex) return registro;
        const updatedFields = registro.customFields.filter((_, fIndex) => fIndex !== fieldIndex);
        return {...registro, customFields: updatedFields};
      })
    );
  }, []);

  const actualizarCustomField = useCallback(
    (registroIndex: number, fieldIndex: number, updatedField: Partial<CustomFieldDefinition>) => {
      setTiposRegistros((prev) => {
        return prev.map((registro, rIndex) => {
          if (rIndex !== registroIndex) return registro;
          const updatedFields = registro.customFields.map((field, fIndex) => {
            if (fIndex !== fieldIndex) return field;
            return {...field, ...updatedField};
          });
          return {...registro, customFields: updatedFields};
        });
      });
    },
    []
  );

  const selectOptionsValue = useCallback((field: CustomFieldDefinition) => {
    return field.options?.join(',') || '';
  }, []);

  const onSelectOptionsChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>, registroIndex: number, fieldIndex: number) => {
      const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ, ]/g, '').replace(/,{2,}/g, ',');
      const options = cleaned.split(',').map((opt) => opt.trim());
      actualizarCustomField(registroIndex, fieldIndex, {options});
    },
    [actualizarCustomField]
  );

  const gestionarTiposModalBody: JSX.Element = useMemo(
    () => (
      <>
        {tiposRegistros.map((registro, registroIndex) => (
          <Card className="p-0 shadow rounded-1 mb-2" key={registroIndex}>
            <Card.Body className="p-2 rounded-1 bg-light bg-opacity-100">
              <BTRow className="align-items-end m-0 p-0 column-gap-1">
                <Col className="m-0 p-0">
                  <Form.Label className="font-14 mb-1 lh-1">
                    <strong>Nombre del tipo de registro</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: ppts, motions"
                    value={registro.tipo}
                    onChange={(e) => actualizarTipoRegistro(registroIndex, e.target.value)}
                  />
                </Col>
                <Col xs="auto" className="m-0 p-0 mb-min">
                  <Button
                    className="px-1 py-0 font-16"
                    variant="danger"
                    onClick={() => eliminarTipoRegistro(registroIndex)}>
                    <i className="mdi mdi-trash-can-outline"></i>
                  </Button>
                </Col>
              </BTRow>
              <hr className="border border-success border-1 opacity-25 my-2" />
              <h5 className="font-14 mb-1 lh-1">Campos personalizados</h5>
              {registro.customFields.map((field, fieldIndex) => (
                <Fragment key={fieldIndex}>
                  <BTRow className="align-items-center m-0 p-0 column-gap-1">
                    <Col className="m-0 p-0">
                      <Form.Control
                        placeholder="Nombre"
                        value={field.key}
                        onChange={(e) => actualizarCustomField(registroIndex, fieldIndex, {key: e.target.value})}
                      />
                    </Col>
                    <Col className="m-0 p-0">
                      <Form.Select
                        value={field.type}
                        onChange={(e) =>
                          actualizarCustomField(registroIndex, fieldIndex, {
                            type: e.target.value as CUSTOM_FIELD_TYPE,
                            options: undefined
                          })
                        }>
                        {Object.values(CUSTOM_FIELD_TYPE).map((type) => (
                          <option key={type} value={type}>
                            {optionsTypeLabels[type] || type}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs="auto" className="m-0 p-0 d-flex justify-content-end align-items-center">
                      <Button
                        className="px-1 py-0 font-16"
                        variant="outline-danger"
                        onClick={() => eliminarCustomField(registroIndex, fieldIndex)}>
                        <i className="mdi mdi-trash-can-outline"></i>
                      </Button>
                    </Col>
                    {field.type === CUSTOM_FIELD_TYPE.SELECT && (
                      <Col xs={12} className="m-0 p-0">
                        <Form.Control
                          placeholder="Opciones separadas por coma"
                          className="mt-1"
                          value={selectOptionsValue(field)}
                          onChange={(e) =>
                            onSelectOptionsChange(
                              e as unknown as ChangeEvent<HTMLSelectElement>,
                              registroIndex,
                              fieldIndex
                            )
                          }
                        />
                      </Col>
                    )}
                  </BTRow>
                  {fieldIndex < registro.customFields.length - 1 && (
                    <hr className="border border-primary border-1 opacity-25 my-1" />
                  )}
                </Fragment>
              ))}
              <Button
                className="mt-2 w-100 font-14"
                size="sm"
                variant="outline-primary"
                onClick={() => agregarCustomField(registroIndex)}>
                Agregar campo personalizado
              </Button>
            </Card.Body>
          </Card>
        ))}
        <Button className="w-100 font-14" onClick={agregarTipoRegistro} variant="success" size="sm">
          Agregar tipo de registro
        </Button>
      </>
    ),
    [
      actualizarCustomField,
      actualizarTipoRegistro,
      agregarCustomField,
      agregarTipoRegistro,
      eliminarCustomField,
      eliminarTipoRegistro,
      onSelectOptionsChange,
      selectOptionsValue,
      tiposRegistros
    ]
  );

  const canEditClientes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.editarClientes, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canDeleteClientes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.eliminarClientes, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return (
    <>
      <div className="d-flex gap-1">
        {canEditClientes && (
          <>
            <OverlayTrigger overlay={<Tooltip id="editCliente">Editar Cliente</Tooltip>}>
              <Button id="editCliente" variant="outline-primary py-0 px-1" onClick={showEditCliente}>
                <i className="uil-pen"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger overlay={<Tooltip id="gestionarTipos">Gestionar tipos de registros</Tooltip>}>
              <Button id="gestionarTipos" variant="outline-primary py-0 px-1" onClick={showGestionarTipos}>
                <i className="uil-list-ui-alt"></i>
              </Button>
            </OverlayTrigger>
          </>
        )}
        {canDeleteClientes && (
          <OverlayTrigger overlay={<Tooltip id="deleteUser">Eliminar Cliente</Tooltip>}>
            <Button id="deleteUser" variant="outline-danger py-0 px-1" onClick={showDeleteCliente}>
              <i className="uil-trash"></i>
            </Button>
          </OverlayTrigger>
        )}
        {!canEditClientes && !canDeleteClientes && <span>No tiene permisos</span>}
      </div>
      {canEditClientes && (
        <>
          <GenericModal
            show={editClienteOpen}
            onToggle={editClienteToggle}
            size="lg"
            variant="info"
            headerText={`Editar cliente ${row.original.domain}`}
            submitText="Editar"
            secondaryText="Cancelar"
            body={editModalBody}
            isDisabled={!hasTouched || isUpdateClient || isLoadingUploadFile || isLoadingDeleteFile}
            isLoading={isUpdateClient || isLoadingUploadFile || isLoadingDeleteFile}
            onSend={onEditClient}
          />
          <GenericModal
            show={gestionarTiposOpen}
            onToggle={gestionarTiposToggle}
            variant="info"
            headerText={`Gestionar tipos de registros ${row.original.domain}`}
            body={gestionarTiposModalBody}
            isDisabled={isUpdateClient}
            isLoading={isUpdateClient}
            onSend={onGestionarTipos}
          />
        </>
      )}
      {canDeleteClientes && (
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
      )}
    </>
  );
});

const columns: ColumnDef<Cliente>[] = [
  {
    header: 'Cliente',
    accessorKey: 'nombre',
    cell: clienteNombre
  },
  {
    header: 'Contacto',
    accessorKey: 'contacto',
    cell: ({row}) => (
      <div className="d-flex flex-column table-user">
        <span className="m-0 lh-sm d-inline">
          <span className="fw-bold">Persona de contacto:</span>{' '}
          {row.original.nombrePersonaContacto || 'no persona contacto'}
        </span>
        <span className="m-0 lh-sm d-inline">
          <span className="fw-bold">Email:</span> {row.original.emailPersonaContacto || 'No Email'}
        </span>
        <span className="m-0 lh-sm d-inline">
          <span className="fw-bold">Teléfono:</span> {row.original.telefonoPersonaContacto || 'No Teléfono'}
        </span>
      </div>
    )
  },
  {
    header: 'Fecha creación',
    accessorKey: 'fechaCreacion',
    cell: ({row}) => <>{DateUtils.formatShortDate(DateUtils.parseStringToDate(row.original.fechaCreacion))}</>
  },
  {
    header: 'Dominio',
    accessorKey: 'domain'
  },
  {
    header: 'Link',
    accessorKey: 'branding',
    cell: ({row}) => (
      <a className="link-opacity-100-hover" href={row.original.branding} target="_blank" rel="noreferrer">
        Ir al link
      </a>
    )
  },
  {
    header: 'Documento',
    accessorKey: 'documento',
    cell: ({row}) =>
      row.original.documento ? (
        <a className="link-opacity-100-hover" href={row.original.documento} target="_blank" rel="noreferrer">
          Documento <i className="uil uil-file"></i>
        </a>
      ) : (
        <span className="text-muted">Sin documento</span>
      )
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: clientesAcciones
  }
];

export {columns};
