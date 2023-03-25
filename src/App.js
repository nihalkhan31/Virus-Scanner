// Dependencies required for our application
import { Routes, Route } from "react-router-dom";
import Url from "./pages/Url";
import NavBar from "./components/NavBar";
import File from "./pages/File";
import About from "./pages/About";
import "./App.css";

function App() {
  //App component that renders all the components inside the application
  return (
    <>
      <NavBar />
      <div>
        {/*Navbar Component*/}

        {/* Routes to navigate between different pages like URL, File, About*/}
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/file" element={<File />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

//Home Page of the application
function Layout() {
  return (
    <div>
      <Url />
    </div>
  );
}

export default App;
