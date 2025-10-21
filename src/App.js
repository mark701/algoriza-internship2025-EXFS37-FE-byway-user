import './App.css';
import { Provider } from 'jotai';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Chat from './components/Chat/Chat';

function App() {
  return (
    <Provider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <AppRoutes />
          </main>

          <Chat />
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
