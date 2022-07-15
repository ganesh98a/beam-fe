import React from 'react';

class HtmlBindTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    createMarkup(item) {
        return {__html: item};
    }

    render() {
        return (
            <React.Fragment><p className={this.props.className} dangerouslySetInnerHTML={this.createMarkup(this.props.htmlData)}></p></React.Fragment>
        );
    }
}

export { HtmlBindTag };