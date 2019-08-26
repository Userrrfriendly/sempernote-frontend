import React, { useContext, useState, useEffect } from "react";
import {
  Link,
  Grid,
  Box,
  FormControl,
  TextField,
  CssBaseline,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import FavoriteRounded from "@material-ui/icons/FavoriteRounded";
import { makeStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { Visibility, VisibilityOff } from "@material-ui/icons/";

import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { LOG_IN, FETCH_USER_DATA, MAKE_TOAST } from "../../context/rootReducer";
import { fetchUserDataReq, logInReq, signUpReq } from "../../requests/requests";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: "8px",
    backgroundColor: "red"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    // marginTop: theme.spacing(1)
    marginTop: "8px"
  },
  submit: {
    margin: "24px 0 16px"
  },
  status: {
    marginTop: "1rem"
  },
  error: {
    color: red[900]
  }
}));

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Built with "}
      <FavoriteRounded style={{ paddingTop: "0.5rem" }} />
      {" by "}
      <Link color="inherit" href="https://bentsigourof.cool/" target="_blank">
        Veniamin Tsigourof.
      </Link>
    </Typography>
  );
}

const AuthScreen = () => {
  const [state, setState] = useState({
    logIn: true,
    username: "",
    password: "",
    email: "",
    failedLogIn: false,
    failedSignUp: false,
    showPassword: false
  });

  const dispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const toggleLogIn = () => {
    setState({ ...state, logIn: !state.logIn });
  };

  const guestLogIn = () => {
    setState({
      ...state,
      email: "guest@guest.com",
      password: "guest"
    });
  };

  const onChange = e => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
      failedLogIn: false,
      failedSignUp: false
    });
  };

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const onSubmit = e => {
    //since guestLogIn doesnt pass the event, checks if there is an event in the first place
    e && e.preventDefault();
    const { email, password, username } = state;
    if (!state.logIn) {
      //SUBMIT SIGN UP
      signUpReq(username, email, password)
        .then(res => {
          if (res.data.createUser) {
            setState({ ...state, logIn: true, password: "" });
            // console.log
            dispatch({
              type: MAKE_TOAST,
              message: `User ${res.data.createUser.username} created successfully`,
              variant: "success"
            });
          } else if (res.errors) {
            setState({ ...state, failedSignUp: true });
          }
        })
        .catch(err => {
          dispatch({
            type: MAKE_TOAST,
            message: "Failed to connect. Check your internet connection",
            variant: "error"
          });
        });
    } else {
      //SUBMIT LOG IN
      logInReq(email, password)
        .then(r => {
          if (r.message === "500Internal Server Error") {
            setState({ ...state, failedLogIn: true });
          } else if (r.message === "Failed to fetch") {
            dispatch({
              type: MAKE_TOAST,
              message: "Failed to connect. Check your internet connection",
              variant: "error"
            });
          } else if (r.token) {
            dispatch({
              type: LOG_IN,
              userId: r.userId,
              token: r.token
            });
            return { userId: r.userId, token: r.token };
          }
        })
        .then(res => {
          if (res.userId) {
            fetchUserDataReq(res.userId, res.token).then(userData => {
              dispatch({
                type: FETCH_USER_DATA,
                userName: userData.userName,
                notebooks: userData.notebooks,
                tags: userData.tags,
                notes: userData.notes,
                trash: userData.trash,
                defaultNotebook: userData.defaultNotebook
              });
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    console.log(appState);
  }, [appState]);
  const classes = useStyles();

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {"Wellcome To SemperNote! "}
          </Typography>
          <Typography component="h2" variant="h6" className={classes.status}>
            {state.logIn ? "Login " : "Sign Up "}
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            <FormControl className={classes.form}>
              {!state.logIn && (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="username"
                  type="text"
                  autoFocus
                  onChange={onChange}
                  value={state.username}
                />
              )}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                autoFocus
                onChange={onChange}
                value={state.email}
              />
              {state.failedSignUp && (
                <Typography
                  component="p"
                  variant="caption"
                  className={classes.error}
                >
                  {"A user with this email already exists"}
                </Typography>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                autoComplete="current-password"
                onChange={onChange}
                value={state.password}
                type={state.showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {state.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {state.failedLogIn && (
                <Typography
                  component="p"
                  variant="caption"
                  className={classes.error}
                >
                  {"Invalid Credentials"}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {state.logIn ? "Login " : "Sign Up "}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button
                    type="button"
                    disabled={!state.logIn}
                    onClick={guestLogIn}
                  >
                    Sign in as Guest
                  </Button>
                </Grid>
                <Grid item>
                  <Button type="button" onClick={toggleLogIn}>
                    {state.logIn ? "Switch to Sign Up" : "Switch to Login"}
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          </form>
        </div>
        <Box mt={3}>
          <MadeWithLove />
        </Box>
      </Container>
    </>
  );
};

export default AuthScreen;
