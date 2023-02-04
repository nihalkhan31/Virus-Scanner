import React from 'react';
import { useState, useRef } from 'react';
import {Routes, Route} from 'react-router-dom';
import Url from './Url';
import NavBar from './NavBar';
import File from './File';
import About from './About';
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
