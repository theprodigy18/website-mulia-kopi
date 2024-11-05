import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from './pages/Menu';
import MenuMobile from './pages/MenuMobile';
import DetailMenu from './pages/DetailMenu';
import MoodDetection from './pages/MoodDetection';
import Recommendation from './pages/Recommendation';
import Kasir from './pages/admin/Kasir';
import PesananOnline from './pages/admin/PesananOnline';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyAccount from './pages/VerifyAccount';
import LoginAdmin from './pages/admin/LoginAdmin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import WelcomeUser from './pages/WelcomeUser';

function App() 
{
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/menu/:category' element={<Menu />} />
                    <Route path='/menu-mobile/:category' element={<MenuMobile />} />
                    <Route path='/detail-menu/:idMenu' element={<DetailMenu />} />
                    <Route path="/mood-detection" element={<MoodDetection />} />
                    <Route path='/recommendation/:idScan' element={<Recommendation />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/verify/:email/:token' element={<VerifyAccount />} />
                    <Route path='/welcome' element={<WelcomeUser />} />

                    {/* Route Admin */}
                    <Route path='/admin/login' element={<LoginAdmin />} />
                    <Route path='/admin/kasir' element={<ProtectedRoute element={<Kasir />} />} />
                    <Route path="/admin/po" element={<ProtectedRoute element={<PesananOnline />} />} /> 
                </Routes>
            </Router>
        </div>
    );
}

export default App;
