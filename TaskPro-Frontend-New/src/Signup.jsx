import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { confirmSignup, signup } from "./service";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const location = useLocation();

  const [username, setUsername] = useState("" || location.state?.username);
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirm, setConfirm] = useState(
    location.state?.username ? true : false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    setError(null);
    event.preventDefault();
    try {
      setLoading(true);
      await signup(username, password);
      setConfirm(true);
    } catch (ex) {
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (event) => {
    setError(null);
    event.preventDefault();
    try {
      setLoading(true);
      await confirmSignup(username, confirmationCode);
      navigate("/login", { replace: true });
    } catch (ex) {
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={confirm ? handleConfirm : handleSignup}
        >
          <Box marginY={2} hidden={error === null ? true : false}>
            <Alert severity="error">{error}</Alert>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                disabled={confirm}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} hidden={!confirm}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="confirmationCode"
                label="ConfirmationCode"
                name="confirmationCode"
                autoComplete="confirmationCode"
                value={confirmationCode}
                onChange={(event) => setConfirmationCode(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? <CircularProgress /> : "Sign up"}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
