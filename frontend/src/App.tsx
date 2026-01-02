import {BrowserRouter, Routes, Route} from "react-router-dom"
import ReactDOM from "react-dom/client";
import Homepage from "./pages/Homepage";
import NoPage from "./pages/Error404";

const apiURL = "https://ja2jzzdvd5.execute-api.eu-west-3.amazonaws.com/dev/"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;