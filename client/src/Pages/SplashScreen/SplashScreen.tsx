import MainLayout from "../../Layouts/MainLayout/MainLayout";
import "./SplashScreen.scss";
import { User } from "../../App";
import { Link } from "react-router-dom";
import penIcon from "../../Assets/Icons/pen.svg";

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
                <div className="SplashScreen__HeroImage">
                    <h1>Stowage Plan Sketcher <span>v1.0</span></h1>
                    <p>Efficiently make stowage plans.</p>
                    {props.isAuthenticated ? (
                        <Link to={"/app"}>
                            <button className="SplashScreen__HeroImage__Button">
                                <img src={penIcon} alt="pen icon" />
                                Start sketching now!
                            </button>
                        </Link>
                    ) : (
                        ""
                    )}
                </div>

                <div className="SplashScreen__Reviews">
                    <h1>Reviews</h1>
                </div>

                <div className="SplashScreen__Footer">
                    <h1>Footer</h1>
                    <p>Some resources and a copyright.</p>
                </div>
            </div>
        </MainLayout>
    );
};

export default SplashScreen;
