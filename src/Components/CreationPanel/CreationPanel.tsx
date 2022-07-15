import React from "react";
import Form from "../Form/Form";

export interface CreationPanelProps {
    show: boolean;
}

export class CreationPanel extends React.Component<CreationPanelProps, any> {
    constructor(props: CreationPanelProps) {
        super(props);

    }

    render() {
        if (this.props.show) {
            return (
                <div className="CreationPanel">
                    <Form />
                </div>
            )
        }
    }
}

export default CreationPanel;