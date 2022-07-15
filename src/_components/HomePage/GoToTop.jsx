import React from "react";

export default class GoToTop extends React.Component {
    constructor() {
        super();

        this.state = {
            intervalId: 0,
            thePosition:false
        };
    }
    componentDidMount() {
        document.addEventListener("scroll", () => {
            if (window.scrollY > 170) {
                this.setState({ thePosition: true })
            } else {
                this.setState({ thePosition: false })
            }
        });
        window.scrollTo(0, 0);
    }
    scrollStep() {
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }

    scrollToTop() {
        let intervalId = setInterval(this.scrollStep.bind(this), "0");
        this.setState({ intervalId: intervalId });
    }
    goTopBtn() {
        if (this.state.thePosition) {
            return <button title='Back to top' className='scroll'
                onClick={() => { this.scrollToTop(); }}>
                <span className='arrow-up fa fa-chevron-up'></span>
            </button>;
        } else {
            return '';
        }
    }
    render() {
        return (this.goTopBtn())
    }
}
