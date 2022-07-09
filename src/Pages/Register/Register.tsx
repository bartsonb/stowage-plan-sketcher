import React from "react"
import Form from "../../Components/Form/Form";
import AuthLayout from "../../Layouts/AuthLayout/AuthLayout";

export interface RegisterProps {

}

export class Register extends React.Component<RegisterProps, any> {
    render() {
        return (
            <AuthLayout title="Register">
                <Form />
            </AuthLayout>
        )
    }
}

export default Register;