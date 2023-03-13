import React from "react";
import { useState, useRef } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import Table from "../components/Table";
import { Loader } from "@progress/kendo-react-indicators";
import NavBar from "../components/NavBar";
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
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
const crypto = require("crypto-js");

const initialDataState = {};

function Url() {
  const [loading, setLoading] = useState(false);
  const urlValue = useRef();
  const [view, setView] = useState(false);
  const [value, setValue] = useState(null);
  const [urlId, setUrlId] = useState(null);
  const [result, setResult] = useState();
  const [data, setData] = useState();
  const [dataState, setDataState] = useState(initialDataState);

  let gridPDFExport;
  const exportPDF = () => {
    if (gridPDFExport) {
      gridPDFExport.save(result);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    setData();
    setResult();
    const addUrl = urlValue.current.value;
    const hash = crypto.SHA256(addUrl);
    let url_id = hash.toString();
    console.log(url_id);
    const options = {
      method: "GET",
      url: `https://www.virustotal.com/api/v3/urls/${url_id}`,
      headers: {
        accept: "application/json",
        "x-apikey":
          "d7a57ef7ee3140b9795ed88224fc7d43520225c6bc411e40a881a01b32b23da2",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        const value = response.data?.data?.attributes?.last_analysis_results;
        console.log("VAl", value);
        let arr = [];
        for (const val in value) {
          arr.push(value[val]);
        }
        setData(arr);
        setResult({
          id: response.data.id,
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
        setLoading(false);
        console.error(error);
      });
  };

  console.log("Load", loading);

  const CustomCell = (props) => {
    const value = props.dataItem.result;
    const navigationAttributes = useTableKeyboardNavigation(props.id);
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
        <b>{props.dataItem.result}</b>
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

  return (
    <div className="App">
      <div className="row" style={{ margin: 0 }}>
        <div className="col-lg-4">
          {result && (
            <div style={{ display: "flex", gap: "10px" }}>
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
                <p></p>
              </div>
              <div>
                <h6>
                  {result.malicious} out of {result.total} vendors flagged this
                  URL as malicious
                </h6>
                <h6>Title: {result.title}</h6>
                <h6>URL: {result.url}</h6>
                <h6>ID: {result.id}</h6>
              </div>
            </div>
          )}
        </div>
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
          <div
            className="col-4"
            style={{ margin: "auto", textAlign: "center" }}
          ></div>
        </div>
      </div>
      <div className="col-lg-4">
        <div></div>
      </div>
      {loading && (
        <div className="col-4" style={{ margin: "auto", textAlign: "center" }}>
          <Loader size="large" type="converging-spinner" />
        </div>
      )}
      {data && (
        <Grid
          style={{
            height: "450px",
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
