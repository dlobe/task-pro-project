import React, { useEffect, useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getUser, login, setToken, getStaticContent } from "./service";
import { Box, CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { UserContext } from "./UserContext";
// import { getStaticContent } from "./service";


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

export default function Login() {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [staticcontent,  setStaticContent] = useState(null);
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchStaticContent = async () => {
      //setLoading(true);
      try {
        // setToken();
        const { data } = await getStaticContent();
        setStaticContent(data);
      } catch (ex) {
        // snackbar("Unable to fetch data.", { variant: "error" });
      } finally {
        //setLoading(false);
      }
    };
    fetchStaticContent();

  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(username, password);
     
      setToken();
     
      setUser(getUser());
   
      navigate("/", { replace: true });
    } catch (ex) {
      if (ex.response?.data?.code === "UserNotConfirmedException") {
        navigate("/signup", {
          state: {
            username,
          },
        });
      }
      setError(ex.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
          
        </Avatar> */}
        <img src={ (staticcontent == null) ? '' : staticcontent[0].Content.logo } />
        <Typography component="h1" variant="h5">
          {/* { console.log(staticcontent) } */}
          { (staticcontent == null) ? '' : staticcontent[0].Content.loginTitle }
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
                label= { (staticcontent == null) ? '' : staticcontent[0].Content.inputEmail }
                name="email"
                autoComplete="email"
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? <CircularProgress /> :  (staticcontent == null) ? '' : staticcontent[0].Content.btnLogin }
          </Button>
          <Grid container justify="space-between">
            <Grid item>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
              >
                Forgot Password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
