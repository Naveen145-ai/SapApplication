import './App.css';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import MarksView from './pages/MarksView/MarksView';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import EventsForm from './pages/EventsForm/EventsForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/events-form' element={<EventsForm />} />
        <Route path='/marks-view' element={<MarksView />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
