import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from '@src/screens/HomeScreen';
import KioskScreen from '@src/screens/KioskScreen';
import PosScreen from '@src/screens/PosScreen';
import StatusScreen from '@src/screens/StatusScreen';
import '@src/styles/global.css';

const BASENAME = '/sample/advance-kiosk';

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/kiosk" element={<KioskScreen />} />
        <Route path="/pos" element={<PosScreen />} />
        <Route path="/status" element={<StatusScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
