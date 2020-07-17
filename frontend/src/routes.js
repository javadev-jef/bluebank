import React from "react";
import App from "./App";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import MediaQuery from 'react-responsive';
import ResolutionError from "./pages/ResolutionError";
import Register from "./pages/Register";
import Home from "./pages/Home";

const Routes = () =>
{
    
    return(
        <>
            <MediaQuery minDeviceWidth={800}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={App}/>
                        <Route path="/register" component={Register}/>
                        <Route path="/home" component={Home}/>
                    </Switch>
                </BrowserRouter>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={799}>
                <ResolutionError />
            </MediaQuery>  
        </>
    );
}

export default Routes;