import {Card, Row, Col, Button} from 'react-bootstrap';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {useEffect, useMemo} from 'react';
import {getNombreCompletoUser, getRolesUser, getUserNameUser} from '@/utils';
import {FileUploader} from '@/components';
import useProfileImage from './useProfileImage';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const UserPortadaBox = () => {
  const user = useAppSelector(selectUser);
  const {
    isLoading,
    isProfileImageEdit,
    isUpdatingProfileImage,
    toggleProfileImageEdit,
    hideProfileImageEdit,
    handleImageFile,
    handleImageLoad,
    handleImageRemoved,
    handleOnSubmit,
    resetLoaders,
    profileImage
  } = useProfileImage();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let timeOut: NodeJS.Timeout;
    if (isUpdatingProfileImage.hasLoad) {
      timeOut = setTimeout(() => {
        hideProfileImageEdit();
        resetLoaders();
      }, 100);
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [hideProfileImageEdit, isUpdatingProfileImage.hasLoad, resetLoaders]);

  const userImg: string = useMemo(() => {
    if (user.userImage && user.userImage !== '') return user.userImage;
    else return fallBackLogo;
  }, [user.userImage]);

  const mainHeader: string = useMemo(() => {
    return getNombreCompletoUser(user);
  }, [user]);

  const subHeader: string = useMemo(() => {
    return getUserNameUser(user);
  }, [user]);

  const roles: string = useMemo(() => {
    return getRolesUser(user);
  }, [user]);

  return (
    <Card className="bg-primary">
      <Card.Body className="profile-user-box">
        <Row className="align-items-center row-gap-2">
          <Col xs={'auto'}>
            <div className="avatar-lg position-relative d-inline-block">
              {isProfileImageEdit ? (
                <FileUploader
                  onFileUpload={handleImageFile}
                  onFileRemoved={handleImageRemoved}
                  resetFile={isUpdatingProfileImage.hasLoad}
                  isRounded
                />
              ) : (
                <>
                  <img
                    src={userImg}
                    width={'100%'}
                    height={'100%'}
                    alt="Profile image"
                    className={`rounded-circle object-fit-cover img-thumbnail ${isLoading ? 'loading' : ' w-100  h-100'}`}
                    onLoad={handleImageLoad}
                    loading="lazy"
                  />
                </>
              )}
              {!profileImage ? (
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
              ) : (
                <Button
                  variant="success"
                  className="btn-icon shadow-none p-0 m-0 position-absolute bottom-0 end-0 d-flex justify-content-center align-items-center"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '100px',
                    borderColor: 'transparent'
                  }}
                  onClick={handleOnSubmit}>
                  <i className="mdi mdi-content-save-check font-18 d-flex justify-content-center align-items-center"></i>
                </Button>
              )}
              {isUpdatingProfileImage.startToLoad && (
                <SkeletonLoader customClass="position-absolute top-0 p-0"></SkeletonLoader>
              )}
            </div>
          </Col>
          <Col>
            <h4 className="mt-1 mb-0 text-white">{mainHeader}</h4>
            <p className="mb-1 font-14 text-white opacity-75">{subHeader}</p>
            <ul className="mb-0 list-inline text-light">
              <li className="list-inline-item me-3">
                <h5 className="mb-0 mt-0 text-white">{user.email}</h5>
                <p className="mb-0 font-14 text-white opacity-75">{roles}</p>
              </li>
            </ul>
          </Col>
          {/* <Col xs={12} sm={4} md={2}>
            <Card className="tilebox-one m-0">
              <Card.Body className="p-2">
                <i className="ri-folder-received-fill float-end text-info"></i>
                <h6 className="text-dark text-uppercase mt-0">
                  <span className="d-none d-xl-inline">Proyectos</span> asignados
                </h6>
                <h2 className="text-info text-opacity-75 mb-0">1000</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Card className="tilebox-one m-0">
              <Card.Body className="p-2">
                <i className="ri-alert-fill float-end text-warning"></i>
                <h6 className="text-dark text-uppercase mt-0">
                  <span className="d-none d-xl-inline">Proyectos</span> Pendientes
                </h6>
                <h2 className="text-warning text-opacity-75 mb-0">800</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Card className="tilebox-one m-0">
              <Card.Body className="p-2">
                <i className="ri-checkbox-fill float-end text-success"></i>
                <h6 className="text-dark text-uppercase mt-0">
                  <span className="d-none d-xl-inline">Proyectos</span> Entregados
                </h6>
                <h2 className="text-success text-opacity-75 mb-0">200</h2>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Card.Body>
    </Card>
  );
};

export {UserPortadaBox};
