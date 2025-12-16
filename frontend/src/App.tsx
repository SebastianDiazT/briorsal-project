import { Route, BrowserRouter as Router, Routes } from 'react-router';
import UserLayout from './layouts/User/UserLayout';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<>Home</>} />
                    <Route path="/projects" element={<>Projects</>} />
                    <Route path="/about" element={<>About</>} />
                    <Route path="/services" element={<>Services</>} />
                    <Route path="/contact" element={<>Contact</>} />
                </Route>
            </Routes>
        </Router>
    );
}
