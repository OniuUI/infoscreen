// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Container from "./components/mainbody";
import Admin from './components/admin/admin';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
    );
};

export default App;
