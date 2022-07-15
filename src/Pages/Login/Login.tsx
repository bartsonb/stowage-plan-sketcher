import React from "react";
import Form from "../../Components/Form/Form";
import AuthLayout from "../../Layouts/AuthLayout/AuthLayout";

export interface LoginProps {
    isAuthenticated: boolean;
}

export class Login extends React.Component<LoginProps, any> {

    private handleSubmit = (event) => {
        event.preventDefault();

    }

    render() {
        return (
            <AuthLayout title="Login">
				<Form handleSubmit={this.handleSubmit}>
                    <h1>Login</h1>
                    <input type="text" placeholder="E-Mail" autoComplete='current-email' />
                    <input type="password" placeholder="Password" name="" id="" autoComplete='current-password' />
                    
                    <input type="submit" value="Login" />
                </Form>
            </AuthLayout>
        );
    }
}

export default Login;
