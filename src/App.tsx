import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import SplashScreen from "./Pages/SplashScreen/SplashScreen";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import About from "./Pages/About/About";
import UserProfile from "./Pages/UserProfile/UserProfile";

import './Assets/Styles/_general.scss';
import Home from "./Pages/Home/Home";

export interface AppProps {

}

export class App extends React.Component<AppProps, any> {
  public state = {
    isAuthenticated: true
  }

  componentDidMount(): void {
    // TODO check if user is logged in ON MOUNT
  }

  public handleUserLogin = () => {

  }

  render() {
    let routes = (
      <Routes>
        <Route path="/login" element={<Login isAuthenticated={this.state.isAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<SplashScreen />} />
      </Routes>
    )

    if (this.state.isAuthenticated) {
      routes = (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      )
    }

    return <Router>{routes}</Router>
  }
}

export default App;