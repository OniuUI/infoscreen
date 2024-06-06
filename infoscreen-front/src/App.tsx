// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from "./components/mainbody";
import Admin from './components/admin/admin';
import Thirsty from "./components/thirsty/thirsty";
import Login from "./components/login";
import Profile from "./components/hub/profile/profile";
import Hub from "./components/hub/hub";
import Kaizen from "./components/kaizen";
import Kaizenview from "./components/kaizenview";


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
          <Route path="/kaizen" element={<Kaizen />} />
          <Route path="/kaizenview" element={<Kaizenview />} />
        </Routes>
      </div>
    </Router>
    );
};

export default App;
