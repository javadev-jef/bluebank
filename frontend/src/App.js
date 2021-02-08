import React from 'react';
import { Redirect } from 'react-router-dom';
import {routes} from "./constants/paths.json";

function App() {
  return (
    <Redirect to={routes.logon} />
  );
}

export default App;
