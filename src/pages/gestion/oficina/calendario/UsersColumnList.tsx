import {memo, useState, ChangeEvent} from 'react';
import {Button, Form, Image} from 'react-bootstrap';
import {Employee} from '@/types';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import SimpleBar from 'simplebar-react';
import {Link} from 'react-router-dom';
import {getUserNameUser} from '@/utils';
import fallBackLogo from '@/assets/images/logo-fallback.png';

const ITEMS_PER_PAGE = 10;

interface UserColumnProps {
  users: Employee[];
  isLoadingUsers: boolean;
  onUserSelect: (user: Employee) => void;
  search: (text: string) => void;
  selectedUser: Employee | null;
}

export const UsersColumnList = memo(function UsersColumnList({
  users,
  isLoadingUsers,
  onUserSelect,
  search,
  selectedUser
}: UserColumnProps) {
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };
  return (
    <>
      <h4 className="header-title text-dark text-opacity-75 m-0">Usuarios</h4>
      <div className="tab-pane show active card-body pb-0 px-0 h-75">
        <div className="app-search">
          <Form>
            <Form.Group className="mb-2 w-100 position-relative">
              <Form.Control
                type="text"
                size="sm"
                placeholder="Usuarios..."
                disabled={isLoadingUsers}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  search(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="mdi mdi-magnify search-icon"></span>
            </Form.Group>
          </Form>
        </div>
        {isLoadingUsers ? (
          <SkeletonLoader customClass="p-0 h-50" />
        ) : (
          <>
            <SimpleBar style={{maxHeight: '100%', width: '100%'}}>
              {paginatedUsers.map((user, index) => {
                return (
                  <Link to="" key={index} className="text-body" onClick={() => onUserSelect(user)}>
                    <div
                      className={`d-flex align-items-center px-1 py-1 ${user.id === selectedUser?.id ? 'bg-light' : ''}`}>
                      <div className="position-relative">
                        {!iconHasLoad && <SkeletonLoader customClass="position-absolute p-0 w-75" />}
                        <Image
                          src={user.userImage ? user.userImage : fallBackLogo}
                          loading="lazy"
                          alt=""
                          className="me-2 rounded-circle object-fit-contain"
                          width={30}
                          height={30}
                          onLoad={() => setIconHasLoad(true)}
                        />
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <span className="m-0 lh-sm fw-bold text-uppercase text-dark text-opacity-75 d-inline">
                          {getUserNameUser(user)}
                        </span>
                        <span className="m-0 lh-sm d-inline">{user.email}</span>
                        {user.id === selectedUser?.id && (
                          <i className="position-absolute end-0 mdi mdi-menu-right font-36" />
                        )}
                      </div>
                    </div>
                    <hr className="m-0 p-0" />
                  </Link>
                );
              })}
            </SimpleBar>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Button
                size="sm"
                variant="secondary"
                className="py-0 px-1"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}>
                <i className="uil uil-angle-double-left"></i>
              </Button>
              <span className="text-muted small">
                Página {currentPage} de {totalPages} ({users.length} usuarios)
              </span>
              <Button
                size="sm"
                variant="secondary"
                className="py-0 px-1"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}>
                <i className="uil uil-angle-double-right"></i>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
});
