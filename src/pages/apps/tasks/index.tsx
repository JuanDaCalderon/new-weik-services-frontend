import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const List = lazy(() => import('./List'));

export default function Dashboard() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route path="list" element={<List />} />1
      </Route>
    </Routes>
  );
}
