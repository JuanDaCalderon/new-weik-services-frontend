import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const Products = lazy(() => import('./Products'));
const Orders = lazy(() => import('./Orders'));
const OrderDetails = lazy(() => import('./OrderDetails'));
const Customers = lazy(() => import('./Customers'));
const Checkout = lazy(() => import('./Checkout'));
const Sellers = lazy(() => import('./Sellers'));

export default function Dashboard() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order-details" element={<OrderDetails />} />
        <Route path="customers" element={<Customers />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="sellers" element={<Sellers />} />
      </Route>
    </Routes>
  );
}
