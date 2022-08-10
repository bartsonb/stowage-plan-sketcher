import { Link } from "react-router-dom";
import AuthForm, { AuthFormType } from "../../Components/AuthForm/AuthForm";
import "./Register.scss";
import axios from "axios";

export interface RegisterProps {
    loginUser(token: string, user: any);
}

export const Register = (props: RegisterProps) => {
    
    const handleSubmit = (req) => {
        const token = req.data.token;

        // GET on the AUTH route, returns the current user if token is correct.
        axios({
            method: "get",
            url: "/api/auth",
            headers: { "x-auth-token": token },
        })
            .then((res) => {
                props.loginUser(token, res.data);
            });
    };

    return (
        <div className="Register">
            <div className="Register__Container">
                <div className="Register__Container__Title">
                    <h1>Register</h1>
                    <p>Create an account for free.</p>
                </div>

                <AuthForm
                    type={AuthFormType.Register}
                    callback={handleSubmit}
                />

                <div className="Register__Container__Links">
                    <Link to={"/"}>Back</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
