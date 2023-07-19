import { BrowserRouter, Route,Router, Routes} from 'react-router-dom';
import { EuiProvider } from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_dark.css";
import LoginPage from './pages/login';
import "./assests/Style.css";
import Dashboard from './pages/dashBoard';
import ProtectedRoute from './helpers/protectedRoute';
function App() {
  return (
    <div className="App">
      <EuiProvider colorMode="dark">
        <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>} />

        <Route path='/' element={
                <ProtectedRoute>
        < Dashboard/>
        </ProtectedRoute>
}/>
      </Routes>
      </BrowserRouter>
      </EuiProvider>
    </div>
  );
}

export default App;
