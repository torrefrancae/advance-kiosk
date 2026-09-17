import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CashierScreen from '@src/screens/CashierScreen';
import CookScreen from '@src/screens/CookScreen';
import DemoScreen from '@src/screens/DemoScreen';
import HomeScreen from '@src/screens/HomeScreen';
import KioskScreen from '@src/screens/KioskScreen';
import StatusScreen from '@src/screens/StatusScreen';
import '@src/styles/global.css';

const BASENAME = '/sample/advance-kiosk';

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/demo" element={<DemoScreen />} />
        <Route path="/kiosk" element={<KioskScreen />} />
        <Route path="/cashier" element={<CashierScreen />} />
        <Route path="/cook" element={<CookScreen />} />
        <Route path="/pos" element={<Navigate to="/cashier" replace />} />
        <Route path="/status" element={<StatusScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
