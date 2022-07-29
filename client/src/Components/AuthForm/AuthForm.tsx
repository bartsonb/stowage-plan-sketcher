import { useState } from "react";
import "./AuthForm.scss";
import { SyncLoader } from "react-spinners";
import axios from "axios";

type errorObject = {
    message?: any[],
    password: Boolean,
    email: Boolean
}

export enum AuthFormType {
    Login = "Login",
    Register = "Register",
}

export interface AuthFormProps {
    type: AuthFormType;
    callback: any;
}

export const AuthForm = (props: AuthFormProps) => {
    const { type, callback } = props;

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState<errorObject | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event: any): any => {
        event.preventDefault();

        if (!loading) {
            setLoading(true);
            setError(null);

            const route = type === AuthFormType.Login 
                ? 'auth'
                : 'users';

            axios({
                url: "http://localhost:5000/api/" + route,
                method: "post",
                data: { email, password },
            })
                .then((res) => handleSuccessfulRequest(res))
                .catch((error) => handleFailedRequest(error));
        }
    };

    const handleSuccessfulRequest = (res) => {
        setLoading(false);
        setError(null);

        console.log(res);
    };

    const handleFailedRequest = (error) => {
        setLoading(false);

        let errorObject: errorObject = {
            message: [],
            email: false, 
            password: false
        };

        const parsedResponse = JSON.parse(error.request.responseText);

        parsedResponse.details.map((el, index) => {
            errorObject.message.push(<p key={index}>- {el.message}.</p>);
            errorObject[el.context.key] = true;
        });

        setError(errorObject);
    };

    const updateEmail = (event: any): void => {
        setEmail(event.target.value);
    };

    const updatePassword = (event: any): void => {
        setPassword(event.target.value);
    };

    return (
        <form className="AuthForm" onSubmit={handleSubmit}>
            <input
                className={`AuthForm__Input ${error?.email ? 'AuthForm__Input--error' : ''}`}
                type="text"
                onChange={updateEmail}
                placeholder="E-Mail"
                autoComplete="current-email"
            />
            <input
                className={`AuthForm__Input ${error?.password ? 'AuthForm__Input--error' : ''}`}
                type="password"
                onChange={updatePassword}
                placeholder="Password"
                autoComplete="current-password"
            />

            {error ? <div className="AuthForm__ErrorMessage">{error.message}</div> : ""}

            <button type="submit" className="AuthForm__Submit">
                {loading ? (
                    <SyncLoader loading={true} size={8} color={"#fff"} />
                ) : (
                    type
                )}
            </button>
        </form>
    );
};

export default AuthForm;
