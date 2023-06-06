// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Container from "./components/mainbody";
import Admin from './components/admin/admin';
import Thirsty from "./components/thirsty/thirsty";
import Login from "./components/login";
import Profile from "./components/hub/profile/profile";
import Hub from "./components/hub/hub";


const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/thirsty" element={<Thirsty />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/hub/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
    );
};

export default App;
