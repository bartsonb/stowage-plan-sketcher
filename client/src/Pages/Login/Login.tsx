import React from "react";
import { Link } from "react-router-dom";
import Form from "../../Components/Form/Form";
import "./Login.scss";

export interface LoginProps {}

export class Login extends React.Component<LoginProps, any> {
    private handleSubmit = (event) => {
        event.preventDefault();
    };

    render() {
        return (
            <div className="Login">
                <div className="Login__Container">
                    <div className="Login__Container__Title">
                        <h1>Login</h1>
                        <p>Welcome back.</p>
                    </div>

                    <Form handleSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            placeholder="E-Mail"
                            autoComplete="current-email"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name=""
                            id=""
                            autoComplete="current-password"
                        />

                        <input type="submit" value="Login" />
                    </Form>


                <div className="Login__Container__Links">
                    <Link to={'/'}>Back</Link>
                </div>
                </div>

            </div>
        );
    }
}

export default Login;
