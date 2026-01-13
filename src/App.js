import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Camera from './components/Camera/Camera';
import Upload from './components/Upload/Upload';
import Final from './components/Final/Final';
import './App.css';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="logo" onClick={() => navigate('/')}>
      <img src="Assets/fish-photobooth/logo-new.png" alt="Logo" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/final" element={<Final />} />
        </Routes>
      </div>
    </Router>
  );
}

export { Logo };
export default App;