import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import Form from "../../Components/Form/Form";
import "./Register.scss";

export interface RegisterProps {}

export class Register extends React.Component<RegisterProps, any> {
    constructor(props: RegisterProps) {
        super(props);

        this.state = {
            email: null,
            password: null
        }
    }

    private handleChange = ({ target }) => {
        this.setState({
            [target.name]: target.value
        });
    }

    private handleSubmit = (event) => {
        axios({
            url: 'http://localhost:5000/api/users', 
            method: 'post', 
            data: {
                email: this.state.email, 
                password: this.state.password
            }
        })
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            })
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
                            name="email"
                            placeholder="E-Mail"
                            autoComplete="current-email"
                            onChange={this.handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            autoComplete="current-password"
                            onChange={this.handleChange}
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
