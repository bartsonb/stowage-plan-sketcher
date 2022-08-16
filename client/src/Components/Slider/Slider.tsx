import { useEffect } from "react";
import heroImage from "../../Assets/Images/application.png";
import "./Slider.scss";

export interface SliderProps {
    speed: number;
}

export const Slider = (props: SliderProps) => {

    useEffect(() => {

    });

    return (
        <div className="Slider">
            <img src={heroImage} alt="" />
        </div>
    );
}

export default Slider;