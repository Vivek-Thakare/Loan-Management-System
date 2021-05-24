import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import UserDash from "./Components/layout/Dashboard/UserDash";
import Footer from "./Components/layout/Footer";
import Navbar from "./Components/layout/Navbar/Navbar";
import AdminDash from "./Components/layout/Dashboard/AdminDash";
import LoanForm from "./Components/Details/LoanForm";
import Payment from "./Components/Details/Payment";
import Login from "./Components/auth/Login";
import ProtectedRouteAdmin from "./Components/auth/ProtectedRouteAdmin";
import ProtectedRouteUser from "./Components/auth/ProtectedRouteUser";
import { AuthContextProvider } from "./Components/auth/auth-context";
import { Provider } from "react-redux";
import store from "./Components/store/store";
import { Suspense } from "react";
import Spinner from "./Components/layout/Spinner";

const Profile = React.lazy(() => import('./Components/Profile/Profile')); //lazy loading syntax


const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <AuthContextProvider>
      <div>
        <Suspense fallback={ //for lazy loading
          <Spinner/>
        }>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            
            <React.Fragment>
              <div className="text-center">
                <Navbar />
                <ProtectedRouteUser exact path="/user" component={UserDash} />
                <ProtectedRouteAdmin exact path="/admin" component={AdminDash} />
                <ProtectedRouteUser exact path="/profile" component={Profile} />
                <ProtectedRouteUser exact path="/newloan" component={LoanForm} />
                <ProtectedRouteUser exact path="/payment" component={Payment} />
                <br />
                <Footer />
              </div>
            </React.Fragment>
          </Switch>
        </Suspense>
      </div>
      </AuthContextProvider>
    </Router>
    </Provider>
  );
};

export default App;
