import React, { useState, useEffect, Fragment } from "react";
import "./App.scss";
import { apiCalls } from "../../apiCalls";
import CardController from "../CardController";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RandomizerButton from "../RandomizerButton";
import AddMyOwnColors from "../AddMyOwnMyColors/index.js";

const App = () => {
  const [rgbValues, setRgbValues] = useState(null);
  const [hexCodes, setHexCodes] = useState(null);
  const [userInputs, setUserInputs] = useState(null);
  const [colorInputsToggle, setColorInputsToggle] = useState(false);
  const [error, setError] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  const getColors = () => {
    apiCalls
      .getRandomPalette()
      .then((data) => {
        setRgbValues(data);
        rgbToHex(data);
        setUserInputs(data);
      })
      .catch((err) => setError(err.message));
  };

  const getColorsWithInput = (input) => {
    let colors = [[...input], "N", "N", "N"];
    apiCalls.getRandomPaletteFromInput(colors).then((data) => {
      setRgbValues(data);
      rgbToHex(data);
    });
  };

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  const rgbToHex = (data) => {
    const hexCodes = data.map((color) => {
      const r = color[0];
      const g = color[1];
      const b = color[2];

      return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    });
    setHexCodes(hexCodes);
    setUserInputs({ ...userInputs, hexCodes: hexCodes });
  };

  const toggleColorInputs = () => {
    setColorInputsToggle(!colorInputsToggle);
  };

  const submitColorInput = (input) => {
    let validRgb;
    const rgbSplit = input.split(",");
    const rgbFormat = rgbSplit.map((value) => {
      return parseInt(value);
    });
    if (
      rgbFormat.length === 3 &&
      rgbFormat[0] <= 255 &&
      rgbFormat[1] <= 255 &&
      rgbFormat[2] <= 255 &&
      rgbFormat[0] >= 0 &&
      rgbFormat[1] >= 0 &&
      rgbFormat[2] >= 0
    ) {
      validRgb = true;
    }

    if (validRgb) {
      randomizePaletteWithInput(rgbFormat);
    }
  };

  const randomizePalette = () => {
    getColors();
  };

  const randomizePaletteWithInput = (input) => {
    getColorsWithInput(input);
  };

  const displaySavePaletteForm = () => {};

  const lockCard = () => {
    //needs to give a class to the ColorCard component to display locked icon
    //need to create a string for the input that it is locking using the rgb val
    //needs to utilize the get random with input...
    //TODO come back to this ... create get random with input string first
  };

  useEffect(() => getColors(), []);

  return (
    <Router>
      <main className="App">
        <h1>Dream Themes</h1>
        {rgbValues && hexCodes && (
          <Route
            path="/colors"
            render={() => (
              <Fragment>
                <CardController
                  style={{}}
                  rgb={rgbValues}
                  hexCodes={hexCodes}
                  lockCard={lockCard}
                  colorInputsToggle={colorInputsToggle}
                  submitColorInput={submitColorInput}
                  displaySavePaletteForm={displaySavePaletteForm}
                />
                <RandomizerButton
                  randomizePalette={randomizePalette}
                  randomizeWithInput={getColorsWithInput}
                />
                <AddMyOwnColors toggleColorInputs={toggleColorInputs} />
              </Fragment>
            )}
          />
        )}
        {showUserForm && <Route path="colors/save-palette" />}
      </main>
    </Router>
  );
};

export default App;
