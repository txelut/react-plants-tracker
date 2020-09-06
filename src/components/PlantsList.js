import React, { Component } from "react";
import "./style.css";
import { Img } from "react-image";

const host = process.env.REACT_APP_PROXY_HOST;
const port = process.env.REACT_APP_PROXY_PORT;
const key = "cachedToken";

const fetch = require("node-fetch");

export default class PlantsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plants: { data: [] },
    };
  }

  onChange = (event) => {
    this.setState({ query: event.target.value });
  };

  onSearch = (event) => {
    event.preventDefault();
    const { query } = this.state;
    if (query === "") {
      return;
    }

    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("token", JSON.parse(localStorage.getItem(key)).token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      (async () => {
        await fetch(
          host + ":" + port + "/proxy/plants/search?q=" + query,
          requestOptions
        )
          .then((response) => response.json())
          .then((response) => this.onSetResult(response))
          .catch((error) => console.log("ERROR:", error));
      })();
    } catch (error) {
      console.log(error);
    }
  };

  onSetResult = (result, key) => {
    this.setState({ plants: result });
    this.setState({ isSubmitted: true });
  };

  render() {
    return (
      <div>
        <h1>Search plants with Trefle API:</h1>

        {/* Search Input */}
        <form onSubmit={this.onSearch}>
          <input type="text" className="input" onChange={this.onChange} />
          <button type="submit">Search</button>
        </form>

        {/* Result */}
        {this.state.plants.data.length === 0 && this.state.isSubmitted ? (
          <h3>Not found.</h3>
        ) : (
          <ul>
            {this.state.plants.data.map((plant) => (
              <li key={plant.id}>
                {/* Multiple fallback images: attempt to load all the images specified in the array'*/}
                <Img src={[plant.image_url, "/image-not-found.png"]} alt="" width="40" height="40" />
                {plant.scientific_name}
                {plant.common_name ? ( <span>&nbsp;{"(" + plant.common_name + ")"}</span>) : ("")}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  async componentDidMount() {
    // Get public token through our API (proxy with Cors) if it's not found in the local storage
    await getTokenProxy();
  }

  componentWillUnmount() {
    this.setState({ isSubmitted: false });
  }
}

async function getTokenProxy() {
  const cachedToken = localStorage.getItem(key);
  // TODO: Add expiration check to retrieve a new token if needed
  if (!cachedToken) {
    await fetch(host + ":" + port + "/proxy/token")
      .then((response) => response.json())
      .then((result) => localStorage.setItem(key, JSON.stringify(result)))
      .catch((error) => console.log("ERROR:", error));
  } else {
    return JSON.parse(cachedToken).token;
  }
}
