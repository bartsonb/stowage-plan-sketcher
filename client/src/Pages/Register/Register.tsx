import React from "react"
import Form from "../../Components/Form/Form";
import AuthLayout from "../../Layouts/AuthLayout/AuthLayout";

export interface RegisterProps {

}

export class Register extends React.Component<RegisterProps, any> {

    private handleSubmit = (event) => {
        event.preventDefault();

    }
    
    render() {
        return (
            <AuthLayout title="Register">
				<Form handleSubmit={this.handleSubmit}>
                    <h1>Register</h1>
                    <input type="text" placeholder="E-Mail" autoComplete='current-email' />
                    <input type="password" placeholder="Password" name="" id="" autoComplete='current-password' />
                    
                    <input type="submit" value="Login" />
                </Form>
            </AuthLayout>
        )
    }
}

export default Register;