import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const LucideIcons = lazy(() => import('./Lucide/LucideIcons'));
const Remix = lazy(() => import('./Remix'));
const MaterialDesign = lazy(() => import('./MaterialDesign'));
const Unicons = lazy(() => import('./Unicons'));

export default function IconsUI() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route path="remix" element={<Remix />} />
        <Route path="mdi" element={<MaterialDesign />} />
        <Route path="unicons" element={<Unicons />} />
        <Route path="lucide" element={<LucideIcons />} />
      </Route>
    </Routes>
  );
}
