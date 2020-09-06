import React from "react";
import "./App.css";
import PlantsList from "./components/PlantsList";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Clear local storage will force to request a new client side token
localStorage.clear();

export default function App() {
  return (
    <Router>
      <div className="App">
        {/*<Route path="/" exact render={() => <h1>Home</h1>} />*/}
        <Route path="/" exact strict component={PlantsList} />
      </div>
    </Router>
  );
}
