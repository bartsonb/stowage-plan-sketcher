import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import SplashScreen from "./Pages/SplashScreen/SplashScreen";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import "./Assets/Styles/_general.scss";
import ErrorPage from "./Components/404/404";
import axios from "axios";

export type User = {
    name: string;
    email: string;
    _id: string;
};

export interface AppProps {}

export class App extends React.Component<AppProps, any> {
    public state = {
        isAuthenticated: false,
        user: JSON.parse(localStorage.getItem("user") as string) || null,
        token: localStorage.getItem("token") || null,
    };

    componentDidMount(): void {
        const { user, token } = this.state;

        axios.defaults.baseURL = "http://localhost:5000";

        if (token && token !== undefined && user && user !== undefined) {
            this.setState({ isAuthenticated: true });
            axios.defaults.headers.common['x-auth-token'] = token;
        }
    }

    public handleUserLogin = (token: string, user: any) => {
        this.setState({ token, user, isAuthenticated: true });

        // Set default authorization header.
        axios.defaults.headers.common['x-auth-token'] = token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    public handleUserLogout = () => {
        this.setState({
            isAuthenticated: false,
            user: null,
            token: null
        });

        // Remove default authorization header.
        delete axios.defaults.headers.common['x-auth-token'];

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    render() {
        let routes = (
            <Routes>
                <Route
                    path="/login"
                    element={<Login loginUser={this.handleUserLogin} />}
                />
                <Route
                    path="/register"
                    element={<Register loginUser={this.handleUserLogin} />}
                />
                <Route
                    path="/"
                    element={
                        <SplashScreen
                            isAuthenticated={this.state.isAuthenticated}
                            logoutUser={this.handleUserLogout}
                            user={this.state.user}
                        />
                    }
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        );

        if (this.state.isAuthenticated) {
            routes = (
                <Routes>
                    <Route
                        path="/"
                        element={
                            <SplashScreen
                                isAuthenticated={this.state.isAuthenticated}
                                logoutUser={this.handleUserLogout}
                                user={this.state.user}
                            />
                        }
                    />
                    <Route
                        path="/app"
                        element={
                            <Home
                                isAuthenticated={this.state.isAuthenticated}
                                logoutUser={this.handleUserLogout}
                                user={this.state.user}
                            />
                        }
                    />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            );
        }

        return <Router>{routes}</Router>;
    }
}

export default App;
