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

export type User = {
    name: string;
    email: string;
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

        if (token && token !== undefined && user && user !== undefined) {
            this.setState({ isAuthenticated: true });
        }
    }

    public handleUserLogin = (token: string, user: any) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        this.setState({ token, user, isAuthenticated: true });
    };

    public handleUserLogout = () => {
        this.setState({
            isAuthenticated: false,
            user: null,
            token: null,
        });

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
