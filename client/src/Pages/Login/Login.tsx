import { Link, useNavigate } from "react-router-dom";
import AuthForm, { AuthFormType } from "../../Components/AuthForm/AuthForm";
import "./Login.scss";

export interface LoginProps {
    handleUserLogin: any;
    isAuthenticated: boolean;
}

export const Login = (props: LoginProps) => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        props.handleUserLogin();

        navigate("/", { replace: true });
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
