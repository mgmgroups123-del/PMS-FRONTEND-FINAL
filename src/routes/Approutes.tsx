import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import DashBoard from '../pages/dashboard/DashBoard';
import Notifications from '../pages/notifications/Notifications';
import Profile from '../pages/profile/Profile';
import Properties from '../pages/properties/Properties';
import Tenants from '../pages/tenants/Tenants';
import RentManagement from '../pages/rent management/RentManagement';
import LeaseManagement from '../pages/lease management/LeaseManagement';
import FinancialReports from '../pages/financial reports/Reports';
import Settings from '../pages/settings/Settings';
import Maintenance from '../pages/maintenance/Maintenance';
import Login from '../pages/auth/login/Login';
import { useAuth } from '../components/auth/AuthContext';
import ViewAllUnits from '../components/property/viewallunit/viewallunit';
import LandHome from '../pages/Land/LandHome';

function Approutes() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return null;

	const AuthRoutes = () => (
		<Routes>
			<Route path='login' element={<Login />} />
			<Route path='*' element={<Navigate to='/login' />} />
		</Routes>
	);

  const PropertyRoutes = () => (
    <Routes>

      <Route path='/' element={<MainLayout />}>
        <Route index element={<DashBoard />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/properties' element={<Properties />} />
        <Route path='/tenants' element={<Tenants />} />
        <Route path='/rent' element={<RentManagement />} />
        <Route path='/lease' element={<LeaseManagement />} />
        <Route path='/reports' element={<FinancialReports />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/maintenance' element={<Maintenance />} />
        <Route path='/viewunits' element={<ViewAllUnits />} />
        <Route path="/settings/*" element={<Settings />} />




        <Route path='/lands' element={<LandHome />} />
      </Route>
    </Routes>
  )
  return isAuthenticated ? <PropertyRoutes /> : <AuthRoutes />
}

export default Approutes;
