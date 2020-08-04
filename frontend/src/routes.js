import React from "react";
import App from "./App";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import MediaQuery from 'react-responsive';
import ResolutionError from "./pages/ResolutionError";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Statement from "./pages/Statement";
import Transfer from "./pages/Transfer";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const Routes = () =>
{
    const theme = createMuiTheme(
    {
        palette: 
        {
            primary: 
            {
                main: "#0091EA"
            },
        },
    });
    
    return(
        <ThemeProvider theme={theme}>
            <MediaQuery minDeviceWidth={800}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={App}/>
                        <Route path="/register" component={Register}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/statement" component={Statement}/>
                        <Route path="/transfer" exact component={Transfer}/>
                    </Switch>
                </BrowserRouter>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={799}>
                <ResolutionError />
            </MediaQuery>  
        </ThemeProvider>
    );
}

export default Routes;