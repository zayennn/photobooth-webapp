import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Camera from './components/Camera/Camera';
import Upload from './components/Upload/Upload';
import Final from './components/Final/Final';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/final" element={<Final />} />
      </Routes>
    </Router>
  );
}

export default App;