import {NavbarProps} from '@/types';
import {getHorizontalMenuItems} from '../utils/menu';
import AppMenu from './Menu';
import {Collapse, Container} from 'react-bootstrap';
import {memo} from 'react';

const Navbar = ({isMenuOpened}: NavbarProps) => {
  return (
    <div className="topnav">
      <Container fluid>
        <nav className="navbar navbar-expand-lg">
          <Collapse in={isMenuOpened}>
            <div className="navbar-collapse active">
              <AppMenu menuItems={getHorizontalMenuItems()} />
            </div>
          </Collapse>
        </nav>
      </Container>
    </div>
  );
};

export default memo(Navbar);
