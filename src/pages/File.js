import React, { useEffect, useState } from "react";
import sha256 from "sha256";
import { Input } from "@progress/kendo-react-inputs";
import "../App.css";
import { Loader } from "@progress/kendo-react-indicators";
import { QRCode } from "@progress/kendo-react-barcodes";
import axios from "axios";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

const initialDataState = {};

//File component of the application
const File = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState();
  const [data, setData] = useState();
  const [hashHex, setHashex] = useState(null);
  const [dataState, setDataState] = useState(initialDataState);

  //PDF export functionality
  let gridPDFExport;
  const exportPDF = () => {
    if (gridPDFExport) {
      gridPDFExport.save(result);
    }
  };

  //Stores the file in the varable when the file is added
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  //Runs sha256function when the file is changed
  useEffect(() => {
    sha256func();
  }, [file]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-apikey":
        "d7a57ef7ee3140b9795ed88224fc7d43520225c6bc411e40a881a01b32b23da2",
    },
  };

  //Function that converts the added file into SHA256
  const sha256func = async () => {
    console.log(file);
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (ev) {
      crypto.subtle
        .digest("SHA-256", ev.target.result)
        .then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashx = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""); // convert bytes to hex string
          setHashex(hashx);
          console.log(hashx);
        })
        .catch((ex) => console.error(ex));
    };
    reader.onerror = function (err) {
      console.error("Failed to read file", err);
    };
  };

  //Function when submit Generate report is clicked
  const onSubmitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setData();
    setResult();
    const options = {
      method: "GET",
      url: "https://www.virustotal.com/api/v3/files/" + hashHex,
      headers: {
        accept: "application/json",
        "x-apikey":
          "d7a57ef7ee3140b9795ed88224fc7d43520225c6bc411e40a881a01b32b23da2",
      },
    };

    //Fetching the results from api
    axios
      .request(options)
      .then(function (response) {
        const value = response.data?.data?.attributes?.last_analysis_results;
        console.log("VAl", response.data);
        let arr = [];
        for (const val in value) {
          arr.push(value[val]);
        }
        setData(arr);

        //Storing the reponse in variable
        setResult({
          total:
            response?.data?.data?.attributes?.last_analysis_stats?.harmless +
            response?.data?.data?.attributes?.last_analysis_stats?.malicious +
            response?.data?.data?.attributes?.last_analysis_stats?.suspicious +
            response?.data?.data?.attributes?.last_analysis_stats?.timeout +
            response?.data?.data?.attributes?.last_analysis_stats?.undetected,
          title: response?.data?.data?.attributes?.title,
          malicious:
            response?.data?.data?.attributes?.last_analysis_stats?.malicious,
          url: response?.data?.data?.attributes?.url,
          id: response?.data?.data?.id,
          md5: response?.data?.data?.attributes?.md5,
          sha1: response?.data?.data?.attributes?.sha1,
          type: response?.data?.data?.attributes?.type_description,
          sha256: response?.data?.data?.attributes?.sha256,
          size: response?.data?.data?.attributes?.size,
        });
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
      });
  };

  //Function to add styling to Clean and Unrated values
  const MyCustomCell = (props) => {
    let colClr = {
      color:
        props.dataItem.category === "undetected"
          ? "green"
          : props.dataItem.category === "type-unsupported"
          ? "grey"
          : "red",
    };
    return <td style={colClr}>{props.dataItem.category.toUpperCase()}</td>;
  };
  //URL component that renders results in kendo react table
  return (
    <div className="App">
      <div className="row" style={{ margin: 0 }}>
        <div className="col-lg-4">
          <form onSubmit={onSubmitHandler}>
            <div className="container">
              <img
                src="../images/file-icon.png"
                alt="File LOGO"
                style={{ height: "120px", width: "auto" }}
              />
              <br />
              <input type="file" onChange={handleChange} />
              <button className="btn btn-primary btn-sm" type="submit">
                Click to Generate Report
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-2">
          {result && (
            <div className="k-card k-text-center">
              <div className="k-card-header">
                <div className="k-card-title">FILE QR</div>
              </div>
              <div className="k-card-body">
                <QRCode value={hashHex} errorCorrection="M" />
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-6">
          {result && (
            <div
              style={{
                display: "flex",
                gap: "20px",
                border: "1px solid #dadada",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  border:
                    result.malicious > 0 ? "7px solid red" : "7px solid green",
                  borderRadius: "100%",
                  width: 100,
                  height: 100,
                  textAlign: "center",
                }}
              >
                <h1>{result.malicious}</h1>
                <h5>/{result.total}</h5>
              </div>
              <div>
                <p>
                  {result.malicious} out of {result.total} vendors flagged this
                  File as malicious
                </p>
                <p>File Type:{result?.type}</p>
                <p>MD5:{result?.md5}</p>
                <p>SHA-1:{result?.sha1}</p>
                <p>SHA-256:{result?.sha256}</p>
                <p>Size:{Math.round(result?.size / 1024)}KB</p>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div
            className="col-4"
            style={{ margin: "auto", textAlign: "center" }}
          >
            <Loader size="large" type="converging-spinner" />
          </div>
        )}
      </div>
      {data && (
        <Grid
          style={{
            margin: "10px",
          }}
          data={process(data, dataState)}
          {...dataState}
          onDataStateChange={(e) => {
            setDataState(e.dataState);
          }}
          sortable={true}
          filterable={true}
          total={data.length}
        >
          <GridToolbar>
            <button
              title="Export PDF"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
              style={{ width: "5rem" }}
              onClick={exportPDF}
            >
              Export PDF
            </button>
          </GridToolbar>
          <GridColumn sortable={true} field="engine_name" title="Engine Name" />
          <GridColumn
            sortable={true}
            field="category"
            title="Category"
            cell={MyCustomCell}
          />
        </Grid>
      )}
    </div>
  );
};

export default File;
