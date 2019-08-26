import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import { Close, Error, CheckCircle } from "@material-ui/icons/";
import StateContext from "../../context/StateContext";
import Slide from "@material-ui/core/Slide";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5)
  },
  success: {
    backgroundColor: "#43a047"
  },
  error: {
    backgroundColor: "#d32f2f"
  },
  message: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: "5px"
  }
}));

export default function Toast() {
  const appState = useContext(StateContext);
  const classes = useStyles();
  const Icon = appState.toast.variant === "success" ? CheckCircle : Error;
  const queueRef = React.useRef([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const processQueue = () => {
    if (queueRef.current.length > 0) {
      setMessageInfo(queueRef.current.shift());
      setOpen(true);
    }
  };

  useEffect(() => {
    const message = appState.toast.message;
    if (message) {
      queueRef.current.push({
        message,
        key: new Date().getTime()
      });

      if (open) {
        // immediately begin dismissing current message
        // to start showing new one
        setOpen(false);
      } else {
        processQueue();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.toast]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    processQueue();
  };

  return (
    <div>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        onExited={handleExited}
        TransitionComponent={SlideTransition}
        ContentProps={{
          "aria-describedby": "message-id",
          classes: {
            root:
              appState.toast.variant === "success"
                ? classes.success
                : classes.error
          }
        }}
        message={
          <span id="message-id" className={classes.message}>
            <Icon className={classes.icon} />
            {messageInfo ? messageInfo.message : undefined}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        ]}
      />
    </div>
  );
}
