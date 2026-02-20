import {BrowserRouter, Routes, Route} from "react-router-dom"
import ReactDOM from "react-dom/client";
import Homepage from "./pages/Homepage";
import NoPage from "./pages/Error404";
import Credits from "./pages/Credits";
import Recettes from "./pages/Recettes";
import Livre from "./pages/Livre";
import Medias from "./pages/Medias";
import Recommandations from "./pages/Recommandations";

const apiURL = process.env.REACT_APP_AWS_API_URL

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/recettes" element={<Recettes />} />
        <Route path="/livre" element={<Livre />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/medias" element={<Medias />} />
        <Route path="/recommandations" element={<Recommandations />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;