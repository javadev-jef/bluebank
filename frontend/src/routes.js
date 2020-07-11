import React from "react";
import App from "./App";
import {BrowserRouter, Switch, Route} from "react-router-dom";

const Routes = () =>
{
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={App}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;