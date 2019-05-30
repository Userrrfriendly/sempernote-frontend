import React, { Component } from "react";
import Context from "../../context/context";
import { logIn, signUp } from "../../helpers/graphQLrequests";
import {
  Link,
  Grid,
  Box,
  FormControl,
  // Avatar,
  // FormControlLabel,
  // Checkbox,
  TextField,
  CssBaseline,
  Button,
  Typography,
  Container
} from "@material-ui/core";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import FavoriteRounded from "@material-ui/icons/FavoriteRounded";
import red from "@material-ui/core/colors/red";
import { withStyles } from "@material-ui/styles";

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

const styles = {
  "@global": {
    body: {
      // backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    // marginTop: theme.spacing(8),
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    // margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main
    margin: "8px",
    backgroundColor: "red"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    // marginTop: theme.spacing(1)
    marginTop: "8px"
  },
  submit: {
    // margin: theme.spacing(3, 0, 2)
    margin: "24px 0 16px"
  },
  status: {
    marginTop: "1rem"
  },
  error: {
    color: red[900]
  }
};

class AuthScreen extends Component {
  state = {
    logIn: true,
    username: "",
    password: "",
    email: "",
    failedLogIn: false,
    failedSignUp: false
  };

  static contextType = Context;

  toggleLogIn = () => {
    this.setState(prevState => {
      return { logIn: !prevState.logIn };
    });
  };

  guestLogIn = async () => {
    await this.setState({
      email: "guest@guest.com",
      password: "guest"
    });
    this.onSubmit();
  };

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
      failedLogIn: false,
      failedSignUp: false
    });
  };

  onSubmit = e => {
    //since guestLogIn doesnt pass the event, checks if there is an event in the first place
    e && e.preventDefault();
    const { email, password, username } = { ...this.state };

    //SUBMIT SIGN UP
    if (!this.state.logIn) {
      const requestBody = {
        query: signUp(username, email, password)
      };

      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed!");
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData);
          if (resData.data.createUser) {
            window.M.toast({
              html: `User ${username} created succesfully! You can now Login`,
              classes: "rounded green"
            });
            this.setState({
              logIn: true,
              password: ""
            });
          } else if (resData.errors) {
            this.setState({
              failedSignUp: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      //SUBMIT LOG IN
      const requestBody = {
        query: logIn(email, password)
      };

      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            if (res.status === 500) {
              //Can't finda a way to access the error message in the response body
              this.setState({
                failedLogIn: true
              });
            }
            throw new Error("Failed!");
          }
          return res.json();
        })
        .then(resData => {
          // console.log(resData);
          if (resData.data.login.token) {
            this.context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            );
          }
        })
        .then(() => {
          this.context.fetchUserData();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    // const classes = useStyles();
    const { classes } = this.props;
    const { logIn } = this.state;
    // console.log(login);
    return (
      <>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
            <Typography component="h1" variant="h5">
              {"Wellcome To SemperNote! "}
            </Typography>
            <Typography component="h2" variant="h6" className={classes.status}>
              {this.state.logIn ? "Login " : "Sign Up "}
            </Typography>
            <form className={classes.form} onSubmit={this.onSubmit}>
              <FormControl className={classes.form}>
                {!this.state.logIn && (
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
                    onChange={this.onChange}
                    value={this.state.username}
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
                  onChange={this.onChange}
                  value={this.state.email}
                />
                {this.state.failedSignUp && (
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
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.password}
                />
                {this.state.failedLogIn && (
                  <Typography
                    component="p"
                    variant="caption"
                    className={classes.error}
                  >
                    {"Invalid Credentials"}
                  </Typography>
                )}
                {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                    <Button
                      type="button"
                      disabled={!logIn}
                      onClick={this.guestLogIn}
                    >
                      Sign in as Guest
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button type="button" onClick={this.toggleLogIn}>
                      {this.state.logIn
                        ? "Switch to Sign Up"
                        : "Switch to Login"}
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
  }
}

export default withStyles(styles)(AuthScreen);
