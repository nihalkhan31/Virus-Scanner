import React from 'react';
import { useState, useRef } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import {Input} from "@progress/kendo-react-inputs";
import Table from '../components/Table';
import { Loader } from "@progress/kendo-react-indicators";
import NavBar from '../components/NavBar';
import '../App.css';

function Url() {
  const [tableDisp, setTableDisp] = useState(false);
  const [loading, setLoading] = useState(false);
  const urlValue = useRef();
  const [view, setView] = useState(false);
  const [value, setValue] = useState(null);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-apikey': 'd7a57ef7ee3140b9795ed88224fc7d43520225c6bc411e40a881a01b32b23da2'
    }
  };
  const submitHandler = (event)=>{
    event.preventDefault();
    setLoading(true);
    const addUrl = urlValue.current.value;
    console.log(addUrl);
    let url_id = btoa(addUrl).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    console.log(url_id);
    fetch('https://www.virustotal.com/api/v3/urls/'+url_id, options)
    .then(response => response.json())
    .then(response => {
      setValue(response.data.attributes.last_analysis_results);
      console.log("abbbbb",response.data);
      console.log(response.data.attributes.last_analysis_results);
      setLoading(false);
      setTableDisp(true);
      })
      .catch(err => console.error(err));
      setView(true);
      
    }
    const arr = [];
    for(const val in value){
        arr.push(value[val]);
    }
    console.log(arr);
  return (
    
    <div className="App ">
     <form onSubmit={submitHandler}>
     <div className='container'>
      <img src = "../images/url-icon.png" alt="URL LOGO"/><br/>
      <div className="col-12 col-md-6 example-col" style={{display:"flex", justifyContent:"center", marginBottom:"0px"}}>
        <Input style={{width: '70%', paddingBottom:'1rem',marginTop:"0px"}} label="URL" ref ={urlValue}/>
      </div>
      <button className="btn btn-primary" type="submit">Click to Generate Report</button>
      </div>
     </form>
     {loading&&
     <div className="col-4" style={{margin:"auto",textAlign:"center"}}>
            <Loader size="large" type="converging-spinner" />
      </div>}
     {tableDisp&&<Table result = {arr}/>}
     
    </div>
    
  );
}

export default Url;
