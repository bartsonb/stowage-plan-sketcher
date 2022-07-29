import { Link } from "react-router-dom";
import AuthForm, { AuthFormType } from "../../Components/AuthForm/AuthForm";
import "./Register.scss";

export interface RegisterProps {}

export const Register = (props: RegisterProps) => {
    const handleSubmit = (event) => {};

    return (
        <div className="Register">
            <div className="Register__Container">
                <div className="Register__Container__Title">
                    <h1>Register</h1>
                    <p>Create an account for free.</p>
                </div>

                <AuthForm type={AuthFormType.Register} callback={handleSubmit} />

                <div className="Register__Container__Links">
                    <Link to={"/"}>Back</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
