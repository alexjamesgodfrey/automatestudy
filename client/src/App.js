import { BrowserRouter as Router } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'
import Home from './components/Home/Home'
import './App.scss';

function App() {
  return (
    <Router >
    <AuthProvider>
      <Home />
    </AuthProvider>
    </Router>
  );
}

export default App;
