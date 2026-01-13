import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Menu from './components/Menu.jsx';
import Camera from './components/Camera.jsx';
import Upload from './components/Upload.jsx';
import Final from './components/Final.jsx';
import './App.css';
import './components/Upload.css';

function App() {
  return (
    <Router>
      <div className="App">
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

export default App;