import logo from './logo.svg';
import './App.css';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
           <Route path='/' element={<SignUp/>}/>
      </Routes>
    </Router>
  );
}

export default App;
