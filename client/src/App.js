import { BrowserRouter as Router } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'
import { ParallaxProvider } from 'react-scroll-parallax';
import Home from './components/Home/Home'
import './App.scss';

function App() {
  return (
    <Router >
    <ParallaxProvider>
    <AuthProvider>
      <Home />
    </AuthProvider>
    </ParallaxProvider>
    </Router>
  );
}

export default App;
