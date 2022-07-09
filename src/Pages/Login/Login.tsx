import React from "react";
import Form from "../../Components/Form/Form";
import AuthLayout from "../../Layouts/AuthLayout/AuthLayout";

export interface LoginProps {
    isAuthenticated: boolean;
}

export class Login extends React.Component<LoginProps, any> {
    render() {
        return (
            <AuthLayout title="Login">
				<Form />
            </AuthLayout>
        );
    }
}

export default Login;
