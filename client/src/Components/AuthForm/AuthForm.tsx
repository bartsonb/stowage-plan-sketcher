import { useState } from "react";
import "./AuthForm.scss";
import { SyncLoader } from "react-spinners";
import axios from "axios";

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

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState([]);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorName, setErrorName] = useState(false);

    const handleSubmit = (event: any): any => {
        event.preventDefault();

        if (!loading) {
            setLoading(true);
            resetErrors();

            const route = type === AuthFormType.Login 
                ? 'auth'
                : 'users';

            axios({
                url: "http://localhost:5000/api/" + route,
                method: "post",
                data: { name, email, password },
            })
                .then((res) => handleSuccessfulRequest(res))
                .catch((error) => handleFailedRequest(error));
        }
    };

    const handleSuccessfulRequest = (res) => {
        resetErrors();

        callback(res);
    };

    const handleFailedRequest = (error) => {
        setLoading(false);

        let errorMessage = [];

        const parsedResponse = JSON.parse(error.request.responseText);
        parsedResponse.details.map((el, index) => {
            errorMessage.push(<p key={index}>{el.message}.</p>);
    
            // Set state flag for wrong password or email.
            // el.context.key syntax is based on JOI Error Object
            if (el?.context?.key === 'password') setErrorPassword(true);
            if (el?.context?.key === 'email') setErrorEmail(true);
            if (el?.context?.key === 'name') setErrorName(true);
        });

        setErrorMessage(errorMessage);
    };

    const updateEmail = (event: any): void => {
        setEmail(event.target.value);
    };

    const updatePassword = (event: any): void => {
        setPassword(event.target.value);
    };

    const updateName = (event: any): void => {
        setName(event.target.value);
    };

    const resetErrors = () => {
        setErrorName(false);
        setErrorEmail(false);
        setErrorPassword(false);
        setErrorMessage([]);
    }

    return (
        <form className="AuthForm" onSubmit={handleSubmit}>
            { 
                props.type === AuthFormType.Register ?
                    <input
                    className={`AuthForm__Input ${errorName ? 'AuthForm__Input--error' : ''}`}
                    type="text"
                    onChange={updateName}
                    placeholder="Username"
                /> : ''
            }
            <input
                className={`AuthForm__Input ${errorEmail ? 'AuthForm__Input--error' : ''}`}
                type="text"
                onChange={updateEmail}
                placeholder="E-Mail"
                autoComplete="current-email"
            />
            <input
                className={`AuthForm__Input ${errorPassword ? 'AuthForm__Input--error' : ''}`}
                type="password"
                onChange={updatePassword}
                placeholder="Password"
                autoComplete="current-password"
            />

            {errorMessage.length > 0 ? <div className="AuthForm__ErrorMessage">{errorMessage}</div> : ""}

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
