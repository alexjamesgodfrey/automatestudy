
import AuthProvider from './contexts/AuthContext'
import Home from './components/Home/Home'
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

export default App;
