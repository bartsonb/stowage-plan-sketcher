import React from "react";
import MainLayout from "../../Layouts/MainLayout/MainLayout";
import "./SplashScreen.scss";

export interface SplashScreenProps {}

export class SplashScreen extends React.Component<SplashScreenProps, any> {
    render() {
        return (
            <MainLayout>
                <div className="Main__HeroImage">
                    <h1>SplashScreen</h1>
                    <p>Efficiently make stowage plans.</p>
                </div>

                <div className="Main__Reviews">
                    <h1>Reviews</h1>
                </div>

                <div className="Main__Footer">
                    <h1>Footer</h1>
                    <p>Some resources and a copyright.</p>
                </div>
            </MainLayout>
        );
    }
}

export default SplashScreen;
