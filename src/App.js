import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Main from "./components/main/main";
import ErrorRoute from "./components/ErrorRoute/errorRoute";
import AuthScreen from "./components/authScreen/authscreen";

import StateContext from "./context/StateContext";
import Toast from "./components/toast_notification/toast";

const App = props => {
  const state = useContext(StateContext);

  return (
    <div className="App">
      <Switch>
        {!state.token && <Redirect exact from="/" to="/auth/" />}
        {!state.token && <Redirect from="/main/" to="/auth/" />}
        {state.token && <Redirect exact from="/auth/" to="/main/" />}
        <Route path="/auth" component={AuthScreen} />
        <Route
          path="/main/"
          render={props => (
            <>
              <Main />
            </>
          )}
        />
        <Route component={ErrorRoute} />
      </Switch>
      <Toast />
    </div>
  );
};

export default App;
