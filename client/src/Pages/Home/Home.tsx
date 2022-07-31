import MainLayout from "../../Layouts/MainLayout/MainLayout";
import Sketcher from "../Sketcher/Sketcher";
import { User } from "../../App";

export interface HomeProps {
    isAuthenticated: boolean;
    user: User;
    logoutUser: any;
}

export const Home = (props: HomeProps) => {
    return (
        <MainLayout
            logoutUser={props.logoutUser}
            isAutheticated={props.isAuthenticated}
            user={props.user}
            className="Sketcher"
        >
            <Sketcher />
        </MainLayout>
    );
};

export default Home;
