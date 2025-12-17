import { Route, BrowserRouter as Router, Routes } from 'react-router';
import UserLayout from './layouts/User/UserLayout';

import About from '@pages/About';
import Projects from '@pages/Projects';
import Services from '@pages/Services';
import Contact from '@pages/Contact';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<>Home</>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>
            </Routes>
        </Router>
    );
}
