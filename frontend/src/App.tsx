import { Route, BrowserRouter as Router, Routes } from 'react-router';

export default function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<h1>Home</h1>} />
                </Routes>
            </Router>
        </>
    );
}
