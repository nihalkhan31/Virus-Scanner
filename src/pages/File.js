import React, { useEffect, useState } from 'react';
import sha256 from 'sha256';
import {Input} from "@progress/kendo-react-inputs";
import Table from '../components/Table';
import '../App.css';
import { Loader } from '@progress/kendo-react-indicators';
const File = () => {
  const [value, setValue] = useState(null);
  const [tableDisp, setTableDisp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(false);
  const [view, setView] = useState(false);
  const [hashHex, setHashex] = useState(null);
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };
  useEffect(() => {
    sha256func();
  },[file]);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-apikey': 'd7a57ef7ee3140b9795ed88224fc7d43520225c6bc411e40a881a01b32b23da2'
    }
  };

  const sha256func = async () => { 
    console.log(file);
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function(ev) { 
            crypto.subtle.digest('SHA-256', ev.target.result).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashx = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
                setHashex(hashx);
                console.log(hashx);
            }).catch(ex => console.error(ex));
        };
        reader.onerror = function(err) {
            console.error("Failed to read file", err);
        }
        
    };
    const onSubmitHandler = (e)=>{
        e.preventDefault();
        console.log("onSubmit");
        console.log("abcd",hashHex);
        setLoading(true);
        setTableDisp(false);
        fetch('https://www.virustotal.com/api/v3/files/'+hashHex, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    console.log("abbbbb",response.data);
                    setValue(response.data.attributes.last_analysis_results);
                    console.log("abbbbb",response.data);
                    console.log("absbbd",response.data.attributes.last_analysis_results);
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
    console.log("aaaaaaa",arr);
  return (
    // <div>
    //   <input type="file" onChange={handleChange} />
    //   <button onClick={handleClick}>Calculate Hash</button>
    //   {hash && <div>SHA-256 Hash: {hash}</div>}
    // </div>
    <div className="App ">
     <form onSubmit={onSubmitHandler}>
     <div className='container'>
      <img src = "../images/file-icon.png" alt="File LOGO" style={{height:"120px", width:"auto"}}/><br/>
      <input type="file" onChange={handleChange} />
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
};

export default File;
