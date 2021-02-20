import MomentUtils from "@date-io/moment";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "moment/locale/pt-br";
import React from "react";
import MediaQuery from 'react-responsive';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import App from "./App";
import { MATERIAL_THEME } from "./constants/constants";
import { routes } from "./constants/paths.json";
import { AuthContext, useAuth } from "./hooks/useAuth";
import Deposit from "./pages/Deposit";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Logon from "./pages/Logon";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResolutionError from "./pages/ResolutionError";
import Statement from "./pages/Statement";
import Transfer from "./pages/Transfer";
import Withdraw from "./pages/Withdraw";

const Routes = () =>
{
    const theme = createMuiTheme(MATERIAL_THEME);

    const auth = useAuth();

    const PrivateRoute = ({component: Component, ...rest}) =>
    (
        <Route {...rest} render={props => (
            auth.isAuthenticated() && !auth.isTokenExpired() ? 
            (
                <Component {...props}/>
            ):( 
                <Redirect to={{pathname: routes.logon, state:{from:props.location}}}/>
            )
        )}/>
    );
    
    return(

        <AuthContext.Provider value={auth}>
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <MediaQuery minDeviceWidth={800}>
                        <BrowserRouter>
                            <Switch>
                                <Route path="/" exact component={App}/>
                                <Route path={routes.logon} exact component={Logon}/>
                                <Route path={routes.register} component={Register}/>
                                <PrivateRoute path={routes.home} component={Home}/>
                                <PrivateRoute path={routes.statement} component={Statement}/>
                                <PrivateRoute path={routes.transfer} exact component={Transfer}/>
                                <Route path={routes.deposit} exact component={Deposit} />
                                <PrivateRoute path={routes.withdraw} exact component={Withdraw} />
                                <PrivateRoute path={routes.profile} exact component={Profile}/>
                                <Route component={Error404}/>
                            </Switch>
                        </BrowserRouter>
                    </MediaQuery>
                    <MediaQuery maxDeviceWidth={799}>
                        <ResolutionError />
                    </MediaQuery>  
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </AuthContext.Provider>
    );
}

export default Routes;