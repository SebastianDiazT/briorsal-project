import { Route, BrowserRouter as Router, Routes } from 'react-router';

import UserLayout from '@layouts/User/UserLayout';
import AdminLayout from '@layouts/Admin/AdminLayout';

export default function App() {

    return (
        <Router>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<>Home</>} />
                </Route>

                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<>Admin</>} />
                </Route>
            </Routes>
        </Router>
    );
}