import { BrowserRouter, Route,Router, Routes} from 'react-router-dom';
import { EuiProvider } from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_dark.css";
import LoginPage from './pages/login';
import "./assests/Style.css";

function App() {
  return (
    <div className="App">
      <EuiProvider colorMode="light">
        <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>} />
      </Routes>
      </BrowserRouter>
      </EuiProvider>
    </div>
  );
}

export default App;
