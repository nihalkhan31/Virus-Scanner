import React from "react";
import { useState, useRef } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Loader } from "@progress/kendo-react-indicators";
import "../App.css";
import axios from "axios";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { QRCode } from "@progress/kendo-react-barcodes";
const crypto = require("crypto-js");

const initialDataState = {};
//  URL component of application
function Url() {
  const [loading, setLoading] = useState(false);
  const urlValue = useRef();
  const [result, setResult] = useState();
  const [data, setData] = useState();
  const [dataState, setDataState] = useState(initialDataState);
  const [urlId, setUrlId] = useState(null);
  //PDF export functionality
  let gridPDFExport;
  const exportPDF = () => {
    if (gridPDFExport) {
      gridPDFExport.save(result);
    }
  };

  //Function when submit Generate report is clicked
  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    setData();
    setResult();
    const addUrl = urlValue.current.value; //To read the value of entered URL
    const hash = crypto.SHA256(addUrl); //converts URL to SHA256
    let url_id = hash.toString(); //SHA256 is converted to string
    setUrlId(url_id);
    const options = {
      method: "GET",
      url: `https://www.virustotal.com/api/v3/urls/${url_id}`, //Appending SHA256 of URL to api end-point
      headers: {
        accept: "application/json",
        "x-apikey":
          "d7a57ef7ee3140b9795ed88224fc7d43520225c6bc411e40a881a01b32b23da2", //api key
      },
    };

    //Fetching the results from api
    axios
      .request(options)
      .then(function (response) {
        const value = response.data?.data?.attributes?.last_analysis_results; //Capturing the response from the api
        console.log("VAl", value);
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
        });
        setLoading(false);
      })
      .catch(function (error) {
        //For error handling
        setLoading(false);
        console.error(error);
      });
  };

  //Function to add styling to Clean and Unrated values
  const CustomCell = (props) => {
    const value = props.dataItem.result;
    return (
      <td
        style={{
          color:
            value === "clean"
              ? props.myProp[0].color
              : value === "unrated"
              ? props.myProp[2]
              : props.myProp[1].color,
        }}
        colSpan={props.colSpan}
        role={"gridcell"}
      >
        <b>{props.dataItem.result.toUpperCase()}</b>
      </td>
    );
  };
  const customData = [
    {
      color: "green",
    },
    {
      color: "red",
    },
    {
      color: "grey",
    },
  ];
  const MyCustomCell = (props) => <CustomCell {...props} myProp={customData} />;

  //URL component that renders results in kendo react table
  return (
    <div className="App">
      <div className="row" style={{ margin: 0 }}>
        <div className="col-lg-4">
          <form onSubmit={submitHandler}>
            <div className="container">
              <img src="../images/url-icon.png" alt="URL LOGO" />
              <br />
              <Input
                style={{
                  width: "100%",
                  paddingBottom: "1rem",
                  marginTop: "0px",
                }}
                label="URL"
                ref={urlValue}
              />
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
                <div className="k-card-title">URL QR</div>
              </div>
              <div className="k-card-body">
                <QRCode value={urlId} errorCorrection="M" />
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
                  URL as malicious
                </p>
                <p>Title: {result.title}</p>
                <p>URL: {result.url}</p>
                <p>ID: {result.id}</p>
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
            field="result"
            title="Result"
            cell={MyCustomCell}
          />
          <GridColumn sortable={true} field="category" title="Category" />
        </Grid>
      )}
    </div>
  );
}

export default Url;
