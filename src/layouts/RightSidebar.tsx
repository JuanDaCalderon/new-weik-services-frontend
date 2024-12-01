import SimpleBar from 'simplebar-react';
import {Offcanvas} from 'react-bootstrap';
import {ThemeSettings, useThemeContext} from '@/common';

const RightSideBar = () => {
  const {updateSettings, settings} = useThemeContext();

  const isOpenRightSideBar = settings.rightSidebar;

  /**
   * Toggles the right sidebar
   */
  const handleRightSideBar = () => {
    updateSettings({rightSidebar: ThemeSettings.rightSidebar.hidden});
  };

  return (
    <>
      <Offcanvas
        show={isOpenRightSideBar}
        onHide={handleRightSideBar}
        placement="end"
        id="theme-settings-offcanvas">
        <Offcanvas.Header
          className="d-flex align-items-center bg-primary p-3"
          closeVariant="white"
          closeButton>
          <h5 className="text-white m-0">Theme Settings</h5>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">
          <SimpleBar scrollbarMaxSize={320} className="h-100">
            <div>off canvas</div>
          </SimpleBar>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default RightSideBar;
