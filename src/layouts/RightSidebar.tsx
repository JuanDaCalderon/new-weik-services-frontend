import SimpleBar from 'simplebar-react';
import {useThemeContext} from '@/common';
import {useCallback} from 'react';
import {Offcanvas} from 'react-bootstrap';

const RightSideBar = () => {
  const {updateSettings, settings} = useThemeContext();

  const toggleRightSideBar = useCallback(() => {
    updateSettings({rightSidebar: {toggle: false}});
  }, [updateSettings]);

  return (
    <>
      <Offcanvas
        show={settings.rightSidebar.toggle}
        onHide={toggleRightSideBar}
        placement="end"
        id="Settings-right-side-bar">
        <Offcanvas.Header
          className="d-flex align-items-center bg-primary p-3"
          closeVariant="white"
          closeButton>
          <h5 className="text-white m-0">Centro de operaciones</h5>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <SimpleBar scrollbarMaxSize={320} className="h-100">
            Aquí debe ir el check-in y el check-out y tambien el modulo de usuarios online y offline
          </SimpleBar>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default RightSideBar;
