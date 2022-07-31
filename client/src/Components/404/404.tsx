import { Navigate } from "react-router-dom";


export interface ErrorPageProps {

}

export const ErrorPage = (props: ErrorPageProps) => {

    return (
        <Navigate to={'/'} replace={true} />
    )
}

export default ErrorPage;