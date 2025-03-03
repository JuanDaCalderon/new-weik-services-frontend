import {memo, useCallback, MouseEvent, JSX, useMemo, useState, ChangeEvent, useEffect} from 'react';
import {Button, Col, Dropdown, Form, Image, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import {GenericModal} from '@/components/Modals/GenericModal';
import {useFileManager, useToggle, useTogglev2} from '@/hooks';
import {Apps, AppsToDb} from '@/types';
import {FileType, FileUploader} from '@/components';
import toast, {Toaster} from 'react-hot-toast';
import {checkIfAppExists, DateUtils, DebugUtil, hasPermission} from '@/utils';
import {useAppSelector} from '@/store';
import {selectApps, selectIsLoadingApps, selectUser} from '@/store/selectores';
import {useAddApp, useDeleteApp, useGetApps, useUploadImage} from '@/endpoints';
import {PERMISOS_MAP_IDS, STORAGE_APPS_PATH, TOAST_DURATION} from '@/constants';
import {SkeletonLoader} from '@/components/SkeletonLoader';
const appDatosIniciales: AppsToDb = {name: '', icon: '', redirectTo: ''};

const AppsDropdown = () => {
  const apps = useAppSelector(selectApps);
  const isLoadingApps = useAppSelector(selectIsLoadingApps);
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  const [newApp, setnewApp] = useState<Partial<AppsToDb>>(appDatosIniciales);
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [shouldResetImage, setShouldResetImage] = useState<boolean>(false);
  const [isOpen, toggleDropdown] = useToggle();
  const {isOpen: isOpenModal, toggle: toggleModal} = useTogglev2();
  const {file, handleFile, handleFileRemoved} = useFileManager();
  const {getAppsSync} = useGetApps();
  const {addApp, isSavingApp} = useAddApp();
  const {isLoadingUploadImage, uploadImage} = useUploadImage();
  const {isDeletingApp, deleteApp} = useDeleteApp();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (apps.length <= 0) getAppsSync();
  }, [apps.length, getAppsSync]);

  const onOpenModal = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleModal();
    },
    [toggleModal]
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setnewApp((prev) => ({...prev, [e.target.name]: e.target.value}));
    setHasTouched(true);
  }, []);

  const handleFileUpload = useCallback(
    (file: FileType) => {
      setShouldResetImage(false);
      handleFile(file);
      setHasTouched(true);
    },
    [handleFile]
  );

  const modalBody: JSX.Element = useMemo(
    () => (
      <>
        <div className="d-flex w-100 flex-column">
          <div className="d-flex justify-content-center flex-column">
            <Form.Label className="mb-0" htmlFor="icon">
              <strong>Icono:</strong>
            </Form.Label>
            <div className="avatar-lg d-block me-auto ms-auto">
              <FileUploader
                onFileUpload={handleFileUpload}
                onFileRemoved={handleFileRemoved}
                acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                resetFile={shouldResetImage}
                isSquarePreview
                ratio="1x1"
              />
            </div>
            <p className="text-danger mt-3 mb-0">Se recomienda imágenes PNG sin fondo y en formato 1:1..</p>
          </div>
          <Form.Label className="cursor-pointer mb-0" htmlFor="name">
            <strong>Nombre:</strong>
          </Form.Label>
          <Form.Control
            size="sm"
            type="text"
            id="name"
            name="name"
            required
            placeholder="Nombre del acceso directo"
            value={newApp.name}
            onChange={handleInputChange}
          />
          <Form.Label className="cursor-pointer mt-1 mb-0" htmlFor="redirectTo">
            <strong>Link:</strong>
          </Form.Label>
          <Form.Control
            size="sm"
            type="url"
            id="redirectTo"
            name="redirectTo"
            pattern="https://.*"
            required
            placeholder="Link externo"
            value={newApp.redirectTo}
            onChange={handleInputChange}
          />
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: TOAST_DURATION,
            style: {
              background: '#4f565c',
              color: '#fff'
            }
          }}
        />
      </>
    ),
    [handleFileRemoved, handleFileUpload, handleInputChange, newApp.name, newApp.redirectTo, shouldResetImage]
  );

  const isValidApp = useCallback((appData: Partial<AppsToDb>): boolean => {
    return !!appData && !!appData.name?.trim() && !!appData.redirectTo?.trim();
  }, []);

  const resetForm = useCallback(() => {
    setShouldResetImage(true);
    setnewApp(appDatosIniciales);
    setHasTouched(false);
  }, []);

  const onAddApp = useCallback(async () => {
    if (!isValidApp(newApp) || !file) {
      toast.error(`Complete todos los campos${!file ? ' y asegúrese de haber subido un icono' : ''}.`);
      setShouldResetImage(!file);
      setHasTouched(false);
      return;
    }
    if (checkIfAppExists(newApp as Apps, apps)) {
      toast.error('El acceso directo no se pudo crear, ya existen registros con el mismo nombre y/o link.');
      return;
    }
    try {
      const imgName = `${newApp.name!}_${DateUtils.getDateOnly(new Date(), '_')}`;
      const imgUrl = await uploadImage(STORAGE_APPS_PATH, imgName, file);
      const app: Apps = {
        name: newApp.name!,
        redirectTo: newApp.redirectTo!,
        icon: imgUrl
      } as Apps;
      await addApp(app);
      await getAppsSync();
      toggleModal();
      resetForm();
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [addApp, apps, file, getAppsSync, isValidApp, newApp, resetForm, toggleModal, uploadImage]);

  const redirectTo = useCallback(
    (redirectTo: string) => {
      toggleDropdown();
      window.open(redirectTo, '_blank', 'noopener,noreferrer');
    },
    [toggleDropdown]
  );

  const onDeleteApp = useCallback(
    async (appId: string) => {
      if (appId) {
        await deleteApp(appId);
        await getAppsSync();
      }
    },
    [deleteApp, getAppsSync]
  );

  const getPermission = useCallback(
    (permisoId: string) => {
      return hasPermission(permisoId, user.roles, user.permisosOtorgados, user.permisosDenegados);
    },
    [user.permisosDenegados, user.permisosOtorgados, user.roles]
  );

  const canCrearApps = useMemo(() => getPermission(PERMISOS_MAP_IDS.crearApps), [getPermission]);
  const canDeleteApps = useMemo(() => getPermission(PERMISOS_MAP_IDS.eliminarApps), [getPermission]);

  const isNotPermisonsLayout: number = useMemo(() => {
    if (apps.length === 1) return canCrearApps ? 6 : 12;
    if (apps.length === 2 && !canCrearApps) return 6;
    return 4;
  }, [apps.length, canCrearApps]);

  const isEmptyAndNotAbleToCreate = useMemo(
    () => apps.length <= 0 && !canCrearApps && !isLoadingApps,
    [apps.length, canCrearApps, isLoadingApps]
  );

  return (
    <>
      <Dropdown show={isOpen} onToggle={toggleDropdown}>
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="dark-mode-toggler">Accesos directos</Tooltip>}>
          <Dropdown.Toggle
            variant="link"
            id="dropdown-apps"
            onClick={toggleDropdown}
            className="nav-link dropdown-toggle arrow-none">
            <i className="ri-apps-2-line font-22"></i>
          </Dropdown.Toggle>
        </OverlayTrigger>

        <Dropdown.Menu
          align={'end'}
          className={`dropdown-menu-animated dropdown-${apps.length >= 2 ? 'lg' : 'sm'} p-0`}>
          {isLoadingApps ? (
            <SkeletonLoader customClass="p-1 m-0" width="100%" height="104px" />
          ) : (
            <div className={`p-${isEmptyAndNotAbleToCreate ? 0 : 1}`}>
              <Row className="g-0">
                {canCrearApps && (
                  <Col xs={apps.length <= 0 ? 12 : apps.length >= 2 ? 4 : 6}>
                    <a href="#" type="button" className="dropdown-icon-item" onClick={onOpenModal}>
                      <i className="mdi mdi-plus position-relative font-24 lh-1" style={{top: '5px'}} />
                      <span>Agregar</span>
                    </a>
                  </Col>
                )}
                {apps.length > 0 &&
                  apps.map((item, index) => (
                    <Col xs={isNotPermisonsLayout} key={index.toString()}>
                      <div className="position-relative p-0 m-0">
                        <a
                          className="dropdown-icon-item position-relative"
                          href="#"
                          onClick={(e: MouseEvent<HTMLElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            redirectTo(item.redirectTo);
                          }}>
                          {!iconHasLoad && (
                            <SkeletonLoader customClass="position-absolute top-50 start-50 translate-middle rounded w-75" />
                          )}
                          <Image
                            className="object-fit-contain"
                            width={24}
                            height="auto"
                            src={item.icon}
                            alt={item.name}
                            onLoad={() => setIconHasLoad(true)}
                            fluid
                          />
                          <span>{item.name}</span>
                        </a>
                        {canDeleteApps && (
                          <Button
                            disabled={isDeletingApp}
                            variant="danger"
                            className="btn-icon shadow-none p-0 mt-1 me-1 position-absolute top-0 end-0 d-flex justify-content-center align-items-center align-content-center scale-hover z-3"
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '100px'
                            }}
                            onClick={() => onDeleteApp(item.id)}>
                            <i className="ri-close-line font-16"></i>
                          </Button>
                        )}
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>
          )}
          {isEmptyAndNotAbleToCreate && (
            <div className="p-1">
              <span className="p-0 m-0">No hay accesos directos aún creados</span>
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {canCrearApps && (
        <GenericModal
          show={isOpenModal}
          onToggle={toggleModal}
          variant="success"
          headerText="Agregar Acceso directo"
          submitText="Agregar"
          secondaryText="Cancelar"
          body={modalBody}
          isDisabled={!hasTouched || isSavingApp || isLoadingUploadImage}
          isLoading={isSavingApp || isLoadingUploadImage}
          onSend={onAddApp}
        />
      )}
    </>
  );
};

export default memo(AppsDropdown);
