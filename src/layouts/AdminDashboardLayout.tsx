
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import type { AuthContext } from '@/hooks/useAuthContext';
import { Outlet, useOutletContext } from 'react-router-dom';

const AdminDashboardLayout = () => {

  const auth = useOutletContext<AuthContext>();  // passing authcontext 
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="w-full py-6 mt-14 md:mb-10 md:pl-56 overflow-x-hidden">
          <div className='px-3 md:px-4'>
            <Outlet context={auth} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
