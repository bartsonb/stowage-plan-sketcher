import { Link, } from "react-router-dom";
import AuthForm, { AuthFormType } from "../../Components/AuthForm/AuthForm";
import "./Login.scss";
import axios from "axios";

export interface LoginProps {
    loginUser(token: string, user: any): void;
}

export const Login = (props: LoginProps) => {

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
        <div className="Login">
            <div className="Login__Container">
                <div className="Login__Container__Title">
                    <h1>Login</h1>
                    <p>Welcome back.</p>
                </div>

                <AuthForm type={AuthFormType.Login} callback={handleSubmit} />

                <div className="Login__Container__Links">
                    <Link to={"/"}>Back</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
