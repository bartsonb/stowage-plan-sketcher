import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "../../Components/Form/Form";
import "./Login.scss";

export interface LoginProps {
    handleUserLogin: any;
    isAuthenticated: boolean;
}

export const Login = (props: LoginProps) => {
    let [ email, setEmail ] = useState(null);
    let [ password, setPassword ] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        props.handleUserLogin();

        navigate("/", { replace: true });
    };

    const updateEmail = (event: any): void => {
        setEmail(event.target.value);
    }

    const updatePassword = (event: any): void => {
        setPassword(event.target.value);
    }

    return (
        <div className="Login">
            <div className="Login__Container">
                <div className="Login__Container__Title">
                    <h1>Login</h1>
                    <p>Welcome back.</p>
                </div>

                <Form handleSubmit={handleSubmit}>
                    <input
                        type="text"
                        onChange={updateEmail}
                        placeholder="E-Mail"
                        autoComplete="current-email"
                    />
                    <input
                        type="password"
                        onChange={updatePassword}
                        placeholder="Password"
                        autoComplete="current-password"
                    />

                    <input type="submit" value="Login" />
                </Form>

                <div className="Login__Container__Links">
                    <Link to={"/"}>Back</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
