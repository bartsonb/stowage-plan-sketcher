import React, { useEffect } from "react";
import "./Toasty.scss";
const { v4 } = require('uuid');

export enum ToasterTypes {
    SUCCESS,
    WARNING,
    FAILURE
}

export interface ToastyProps {
    timeToClose: number;
}

export interface ToastyState {
    toasts: { text: string; description: string, uuid: string, type: ToasterTypes }[];
}

export class Toasty extends React.Component<ToastyProps, ToastyState> {
    constructor(props: ToastyProps) {
        super(props);

        this.state = {
            toasts: [],
        };
    }

    public notify = (text: string, description: string, type: ToasterTypes): void => {
        this.setState((prevState) => {
            return {
                toasts: [
                    ...prevState.toasts,
                    { uuid: v4(), description, text, type },
                ],
            };
        });
    };

    private remove = (uuid: string): void => {
        this.setState((prevState) => {
            return { toasts: prevState.toasts.filter((el) => el.uuid !== uuid) };
        });
    };

    render() {
        const toastyElements = this.state.toasts.map((el, index) => (
            <ToastyElement
                key={el.uuid}
                type={el.type}
                timeToClose={this.props.timeToClose}
                remove={this.remove}
                uuid={el.uuid}
                description={el.description}
                text={el.text}
            />
        ));

        return (
            <div className="Toasty">
                {toastyElements}
            </div>
        );
    }
}

export interface ToastyElementProps {
    type: ToasterTypes;
    uuid: string;
    text: string;
    description: string;
    timeToClose: number;
    remove(uuid: string): void;
}

export const ToastyElement = (props: ToastyElementProps) => {
    const { text, description, uuid, timeToClose, type, remove } = props;

    const getColor = (type: ToasterTypes) => {
        switch(type) {
            case ToasterTypes.SUCCESS:
                return "green";
            case ToasterTypes.WARNING:
                return "yellow";
            case ToasterTypes.FAILURE:
                return "red";
        }
    }
   
    useEffect(() => {
        setTimeout(() => remove(uuid), timeToClose);
    }, [timeToClose, uuid, remove]);

    return (
        <div
            onClick={() => { remove(uuid) }} 
            className="Toasty__Element" style={{
            animation: `fadeOut 500ms ease-in-out ${timeToClose - 450}ms, fadeIn 270ms ease-in-out forwards`
        }}>
            <div className="Toasty__Element_Text">
                <p>{text} {description && <span>{description}</span>}</p>
                <p>x</p>
            </div>
            <div className="Toasty__Element_ProgressBar" style={{
                animationDuration: `${timeToClose}ms`,
                background: getColor(type),
            }}></div>
        </div>
    );
};

export default Toasty;
