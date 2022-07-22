import React from "react";
import { Link } from "react-router-dom";
import Form from "../../Components/Form/Form";
import "./Register.scss";

export interface RegisterProps {}

export class Register extends React.Component<RegisterProps, any> {
    private handleSubmit = (event) => {
        event.preventDefault();
    };

    render() {
        return (
            <div className="Register">
                <div className="Register__Container">
                    <div className="Register__Container__Title">
                        <h1>Register</h1>
                        <p>Create an account for free.</p>
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

                        <input type="submit" value="Register" />
                    </Form>


                <div className="Register__Container__Links">
                    <Link to={'/'}>Back</Link>
                </div>
                </div>

            </div>
        );
    }
}

export default Register;
