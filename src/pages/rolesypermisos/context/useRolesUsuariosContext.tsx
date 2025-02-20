import {ROLES_CELLS, USUARIOS_CELLS} from '@/constants';
import {RolesUsuariosContext, RolesUsuariosContextType} from '@/types';
import {ReactNode, createContext, useCallback, useContext, useState, JSX} from 'react';

const RolesUsuariosContextCreation = createContext<RolesUsuariosContextType | undefined>(undefined);

export function useRolesUsuariosContext() {
  const context = useContext(RolesUsuariosContextCreation);
  if (context === undefined) throw new Error('useRolesUsuariosContext must be used within an ThemeProvider');
  return context;
}

export function RolesUsuariosProvider({children}: {children: ReactNode}): JSX.Element {
  const [rolesUsuarios, setRolesUsuarios] = useState<RolesUsuariosContext>({
    rolesCell: ROLES_CELLS.rol,
    usuariosCell: USUARIOS_CELLS.roles
  });

  const updateRolesCell = useCallback((rolesCell: ROLES_CELLS) => {
    setRolesUsuarios((prev) => ({...(prev ?? {}), rolesCell}));
  }, []);

  const updateUsuariosCell = useCallback((usuariosCell: USUARIOS_CELLS) => {
    setRolesUsuarios((prev) => ({...(prev ?? {}), usuariosCell}));
  }, []);

  return (
    <RolesUsuariosContextCreation.Provider value={{rolesUsuarios, updateRolesCell, updateUsuariosCell}}>
      {children}
    </RolesUsuariosContextCreation.Provider>
  );
}
