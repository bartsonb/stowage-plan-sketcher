import MainLayout from "../../Layouts/MainLayout/MainLayout";
import Sketcher from "../Sketcher/Sketcher";
import { User } from "../../App";

export interface HomeProps {
    isAuthenticated: boolean;
    user: User;
}

export const Home = (props: HomeProps) => {
    return (
        <MainLayout isAutheticated={props.isAuthenticated} user={props.user}>
            <Sketcher />
        </MainLayout>
    );
}

export default Home;