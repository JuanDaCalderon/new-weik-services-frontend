import SimpleBar from 'simplebar-react';
import {useThemeContext} from '@/common';
import {useCallback} from 'react';
import {Offcanvas} from 'react-bootstrap';
import TeamMembers from '@/components/TeamMembers';
import HorarioStatus from '@/components/HorarioStatus';

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
        <Offcanvas.Header className="d-flex align-items-center bg-primary p-3" closeVariant="white" closeButton>
          <h5 className="text-white m-0">Centro de operaciones</h5>
        </Offcanvas.Header>

        <Offcanvas.Body className="px-0">
          <SimpleBar scrollbarMaxSize={320} className="h-100">
            <HorarioStatus />
            <TeamMembers />
          </SimpleBar>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default RightSideBar;
