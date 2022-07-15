import React from 'react';

class TextWrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <React.Fragment> {this.props.text ? (this.props.text.length >
                this.props.limit
                  ? this.props.text.substring(
                      0,
                      this.props.limit
                    ) + "..."
                  : this.props.text) : ''}
            </React.Fragment>
        );
    }
}

export { TextWrap };