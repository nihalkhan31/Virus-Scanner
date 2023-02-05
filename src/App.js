import React from 'react';
import { useState, useRef } from 'react';
import {Routes, Route} from 'react-router-dom';
import Url from './pages/Url';
import NavBar from './components/NavBar';
import File from './pages/File';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <div className="App ">
     <NavBar/>
     <Routes>
      <Route path='/' element = {<Layout/>}/>
      <Route path='/file' element = {<File/>}/>
      <Route path='/about' element = {<About/>}/>
     </Routes>
    </div>
  );
}
function Layout(){
  return(
    <div>
      <Url/>
    </div>
  )
}
export default App;
