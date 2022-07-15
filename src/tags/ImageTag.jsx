import React from 'react';
import * as constand from "../constant";

class ImageTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <React.Fragment><img width={this.props.width} height={this.props.height}
            className={this.props.className}
            src={this.props.src}
            ref={img => this.img = img} onError={
                () => this.img.src = this.props.thumb|| constand.WEB_IMAGES+'no-image.png'}
        /></React.Fragment>
        );
    }
}

export { ImageTag };
