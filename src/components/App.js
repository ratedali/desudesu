import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import HttpsRedirect from "react-https-redirect";
import blue from 'material-ui/colors/blue';
import orange from 'material-ui/colors/orange';
import red from 'material-ui/colors/red';
import Nav from "../containers/NavContainer";
import MediaPage from '../containers/MediaPageContainer';
import Login from '../containers/LoginContainer';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: orange,
    error: red
  }
});

class App extends Component {
  render() {
    return (
      <HttpsRedirect>
        <MuiThemeProvider theme={theme}>
          <div>
            <Nav>
              <main>
                <Switch>
                  <Route path="/login" component={Login}/>
                  <Route path="/browse/:mediaType/search/:search" component={MediaPage}/>
                  <Route path="/browse/:mediaType/:seasonYear/:season" component={MediaPage}/>
                  <Redirect to="/browse/anime/2017/fall"/>
                </Switch>
              </main>
            </Nav>
          </div>
        </MuiThemeProvider>
      </HttpsRedirect>
    );
  }
}

export default App;
