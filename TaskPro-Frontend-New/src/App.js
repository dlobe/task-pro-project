import { Route, Routes } from "react-router-dom";
import SignUp from "./Signup";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import { getUser, refreshToken } from "./service";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import ForgotPassword from "./ForgotPassword";
import Tasks from './Tasks';
import Organizations from './Organizations';
import Contacts from './Contacts';
import Logout from './Logout';
import Works from "./Works";
import Meetings from './Meetings';
const App = () => {
  useEffect(() => {
    const refresh = async () => {
      try {
        await refreshToken();
      } catch (ex) {
        localStorage.clear();
        window.location = "/login";
      }
    };
    refresh();
  }, []);
  const [user, setUser] = useState(getUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <ProtectedRoute path="/tasks">
          <Tasks />
        </ProtectedRoute>
        <ProtectedRoute path="/meetings">
          <Meetings />
        </ProtectedRoute>
        <ProtectedRoute path="/workstream">
          <Works />
        </ProtectedRoute>
        <ProtectedRoute path="/organizations">
          <Organizations />
        </ProtectedRoute>
        <ProtectedRoute path="/contacts">
          <Contacts />
        </ProtectedRoute>
        <ProtectedRoute path="/">
          <Home />
        </ProtectedRoute>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
