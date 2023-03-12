import React from "react";
import { useState, useRef } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import Table from "../components/Table";
import { Loader } from "@progress/kendo-react-indicators";
import NavBar from "../components/NavBar";
import "../App.css";

function Url() {
  const [tableDisp, setTableDisp] = useState(false);
  const [loading, setLoading] = useState(false);
  const urlValue = useRef();
  const [view, setView] = useState(false);
  const [value, setValue] = useState(null);
  const [urlId, setUrlId] = useState(null);
  const [result, setResult] = useState();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-apikey":
        "d7a57ef7ee3140b9795ed88224fc7d43520225c6bc411e40a881a01b32b23da2",
    },
  };
  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    arr = [];
    const addUrl = urlValue.current.value;
    console.log(addUrl);
    let url_id = btoa(addUrl)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    console.log(url_id);
    fetch("https://www.virustotal.com/api/v3/urls/" + url_id, options)
      .then((response) => response.json())
      .then((response) => {
        setValue(response.data.attributes.last_analysis_results);
        console.log(
          "RES",
          response.data.attributes.last_analysis_stats.harmless
        );
        setResult({
          id: response.data.id,
          total:
            response.data.attributes.last_analysis_stats.harmless +
            response.data.attributes.last_analysis_stats.malicious +
            response.data.attributes.last_analysis_stats.suspicious +
            response.data.attributes.last_analysis_stats.timeout +
            response.data.attributes.last_analysis_stats.undetected,
          title: response.data.attributes.title,
          malicious: response.data.attributes.last_analysis_stats.malicious,
        });
        console.log("abbbbb", response.data);
        setLoading(false);
        setTableDisp(true);
      })
      .catch((err) => console.error(err));
    setView(true);
  };
  let arr = [];
  for (const val in value) {
    arr.push(value[val]);
  }
  console.log(arr);
  return (
    <div className="App">
      <div className="row" style={{ margin: 0 }}>
        <div className="col-lg-4">
          {result && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  border:
                    result.malicious > 0 ? "7px solid green" : "7px solid red",
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
          {loading && (
            <div
              className="col-4"
              style={{ margin: "auto", textAlign: "center" }}
            >
              <Loader size="large" type="converging-spinner" />
            </div>
          )}
        </div>
      </div>
      <div className="col-lg-4">
        <div></div>
      </div>

      {tableDisp && <Table result={arr} />}
    </div>
  );
}

export default Url;
