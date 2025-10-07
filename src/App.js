import './App.css';
import { Provider } from 'jotai';
import { HashRouter  as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import Navbar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
<Provider>
  <Router>
  <Navbar />
    <AppRoutes/>
      <Footer/>

  </Router>
</Provider>
  );
}

export default App;
