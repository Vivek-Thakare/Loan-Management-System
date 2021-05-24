import axios from "axios";
import { createContext, useState } from "react";
import { useHistory } from "react-router-dom";



const AuthContext = createContext({
  authData: null,
  token: null,
  loginHandler: () => {},
  logoutHandler: () => {},
  tokenRefreshHandler: () => {}
});

export const AuthContextProvider = (props) => {
  const [login, setLogin] = useState(false);
  const history = useHistory();

  const onLogin = async (username, password, type) => {
    const params = { user_name: username, password: password, type: type };
    try {
      const res = await axios.get("/authenticate", { params: params }); //API call for Admin login Authentication.
      console.log("verifyLogin", res.data);
      if (res.data.login === true) {
        let reqData = {
          id: res.data.id,
          username: res.data.user_name,
          type: type,
        };
        localStorage.token = res.data.access_token
        localStorage.reqData = btoa(JSON.stringify(reqData));//encrypting and storing the required data in local Storage
        setLogin(true); 

        if (type === "Admin") {
          history.replace("/admin");
        }
        if (type === "User") {
          history.replace("/user");
        }
        
      } else {
        alert("Invalid Username or Password");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onLogout = () => {
    localStorage.clear();
  };

  const parseAuthData = () => {
    if(localStorage.reqData !== undefined){
    const { id, username, type } = JSON.parse(atob(localStorage.reqData));
    let obj = {
      id,
      username,
      type
    }
    return obj;
    }else {
      return null;
    }
  }


  return (
    <AuthContext.Provider
      value={{
        authData: parseAuthData(),
        token: localStorage.token,
        loginHandler: onLogin,
        logoutHandler: onLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
