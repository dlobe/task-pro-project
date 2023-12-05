import { useContext } from "react";
import { Navigate, Route } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ children, ...rest }) => {
  const { user } = useContext(UserContext);
  if (user) {
    return <Route {...rest}>{children}</Route>;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
