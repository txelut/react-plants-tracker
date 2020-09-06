const express = require("express");
const cors = require("cors");
const publicIp = require("public-ip");
const fetch = require("node-fetch");

require("dotenv").config();
const host = process.env.REACT_APP_PROXY_HOST;
const port = process.env.REACT_APP_PROXY_PORT;

const app = express();
app.use(cors());

app.get("/proxy/token", (req, res) => getToken(req, res));

app.get("/proxy/*", (req, res) => getData(req, res));

app.listen(port, function () {
  console.log("CORS-enabled web server listening on " + host + ":" + port);
});

async function getToken(req, res) {
  const url = process.env.REACT_APP_TREFLE_API_TOKEN_URL;
  const PRIVATE_API_KEY = process.env.REACT_APP_TREFLE_API_KEY;
  const params = {
    origin: host + ":" + port + "/proxy/token",
    ip: publicIp.v4(),
    token: PRIVATE_API_KEY,
  };
  (async () => {
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    res.json(json);
  })();
}

async function getData(req, res) {

  // Remove "proxy" path from req.url and address it to API url
  const reqUrl = req.url.split("/").slice(2, req.url.length).join("/");

  const apiUrl = process.env.REACT_APP_TREFLE_API_URL;
  const PRIVATE_API_KEY = process.env.REACT_APP_TREFLE_API_KEY;

  //console.log("CLIENT_TOKEN:", req.headers.token);
  (async () => {
    // Using private API key in proxy side instead of the retrieved token
    // TODO: Client token gives an unauthorized response or internal error from Trefle server
    const response = await fetch(apiUrl + "/" + reqUrl + "&token=" + PRIVATE_API_KEY, {
      method: "get",
      headers: { "Content-Type": "application/json" },
      //token: req.headers.token,
    }).catch((error) => console.log("ERROR", error));
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();
    res.json(json);
  })();
}
