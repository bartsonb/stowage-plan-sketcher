import MainLayout from "../../Layouts/MainLayout/MainLayout";
import "./SplashScreen.scss";
import { User } from "../../App";
import { Link } from "react-router-dom";
import Slider from "../../Components/Slider/Slider";

export interface SplashScreenProps {
    isAuthenticated: Boolean;
    logoutUser: any;
    user: User;
}

export const SplashScreen = (props: SplashScreenProps) => {
    return (
        <MainLayout
            logoutUser={props.logoutUser}
            isAutheticated={props.isAuthenticated}
            user={props.user}
        >
            <div className="SplashScreen">
                <div className="Hero">
                    <div className="Hero__Container">
                        <div className="Hero__Container__Left">
                            <h1>Stowage Plan Sketcher</h1>
                            <p>Efficiently make stowage plans.</p>

                            {props.isAuthenticated && <Link to={"/app"}>
                                <div className="Hero__Container__Left__Buttons">
                                    <button className="filled pulsing">
                                        Start <span>Sketcher</span>
                                    </button>
                                </div>
                                </Link>}

                            {!props.isAuthenticated && 
                                <div className="Hero__Container__Left__Buttons">
                                    <Link to={"/register"}>
                                        <button className="filled">
                                            Register
                                        </button>
                                    </Link>
                                    <Link to={"/login"}>
                                        <button className="">
                                            Login
                                        </button>   
                                    </Link>
                                </div>}
                        </div>
                        <div className="Hero__Container__Right">
                            <Slider speed={4000} />
                        </div>
                    </div>
                </div>
                    

                <div className="Reviews">
                    <h1>Reviews</h1>
                </div>

                <div className="Footer">
                    <h1>Footer</h1>
                    <p>Some resources and a copyright.</p>
                </div>
            </div>
        </MainLayout>
    );
};

export default SplashScreen;
