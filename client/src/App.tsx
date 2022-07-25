import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import SplashScreen from "./Pages/SplashScreen/SplashScreen";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import About from "./Pages/About/About";
import UserProfile from "./Pages/UserProfile/UserProfile";
import Home from "./Pages/Home/Home";
import "./Assets/Styles/_general.scss";
import axios from "axios";

export type User = {
    email: string;
};

export interface AppProps {}

export class App extends React.Component<AppProps, any> {
    public state = {
        isAuthenticated: null,
        user: {
            email: null,
        },
    };

    componentDidMount(): void {
        // TODO check if user is logged in ON MOUNT
        axios({
            method: "get",
            url: "http://localhost:5000",
        })
            .then((res) => console.log(res))
            .catch((error) => console.log(error));
    }

    public handleUserLogin = () => {
        this.setState(
            {
                isAuthenticated: true,
                user: {
                    email: "armin.bartnik@web.de",
                },
            }
        );
    };

    render() {
        let routes = (
            <Routes>
                <Route
                    path="/login"
                    element={<Login handleUserLogin={this.handleUserLogin} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<SplashScreen />} />
            </Routes>
        );

        if (this.state.isAuthenticated) {
            routes = (
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                isAuthenticated={this.state.isAuthenticated}
                                user={this.state.user}
                            />
                        }
                    />
                </Routes>
            );
        }

        return <Router>{routes}</Router>;
    }
}

export default App;
