import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    changeSidebarTheme,
    changeSidebarType,
} from "../../store/actions";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RightSideModalSection from "./rightSidebarModal";

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
            isWorkspace: false,
            rightSidebar:false,
        };
        this.toggleMenuCallback = this.toggleMenuCallback.bind(this);

    }



    capitalizeFirstLetter = string => {
        return string.charAt(1).toUpperCase() + string.slice(2);
    };



    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.isPreloader === true) {
                document.getElementById('preloader').style.display = "block";
                document.getElementById('status').style.display = "block";

                setTimeout(function () {

                    document.getElementById('preloader').style.display = "none";
                    document.getElementById('status').style.display = "none";

                }, 2500);
            }
            else {
                document.getElementById('preloader').style.display = "none";
                document.getElementById('status').style.display = "none";
            }
        }
    }

    componentDidMount() {


        // Scroll Top to 0
        window.scrollTo(0, 0);

        let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

        currentage = currentage.replaceAll("-", " ");

        document.title =
            currentage + " | Appmodernize";

        if (this.props.leftSideBarTheme) {
            this.props.changeSidebarTheme(this.props.leftSideBarTheme);
        }



        if (this.props.leftSideBarType) {
            this.props.changeSidebarType(this.props.leftSideBarType);
        }
        if (this.props.showRightSidebar) {
            this.toggleRightSidebar();
        }

        // console.log(this.props.location.pathname)
        let path  = this.props.location.pathname.split("/");
        // console.log(path)
        if (path[1] === "workspace_demo") {
            this.setState({ isWorkspace: true })
        }
        if (path[1] === "canvas") {
            this.setState({ rightSidebar: true })
        }
    }
    toggleMenuCallback = () => {
        if (this.props.leftSideBarType === "default") {
            this.props.changeSidebarType("condensed", this.state.isMobile);
        } else if (this.props.leftSideBarType === "condensed") {
            this.props.changeSidebarType("default", this.state.isMobile);
        }
    };


    render() {

        const { isWorkspace, rightSidebar } = this.state;

        const { RightSideModal } = this.props;



        return (
            <>
                <div id="preloader">
                    <div id="status">
                        <div className="spinner">
                            <i className="ri-loader-line spin-icon"></i>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <div id="layout-wrapper" style={rightSidebar ? { width: '82%' } : { width: '100%' }}>
                        <Header
                            toggleMenuCallback={this.toggleMenuCallback}
                            style={rightSidebar ? { width: '80.5%' } : { width: '100%' }}
                        />
                        {
                            !isWorkspace
                                ?
                                <Sidebar
                                    theme={this.props.leftSideBarTheme}
                                    type={this.props.leftSideBarType}
                                    isMobile={this.state.isMobile}
                                />
                                : null
                        }

                        <div className="main-content" style={isWorkspace ? { marginLeft: 0 } : {}}>
                            {this.props.children}
                            {/* <Footer /> */}
                        </div>
                    </div>
                    {
                        rightSidebar
                            ?
                            <RightSideModalSection />
                            : null
                    }

                    {/* <div className="" style={{ width: '20%' }}>
                        Right side bar
                    </div> */}
                </div>

            </>
        );
    }
}


const mapStatetoProps = state => {
    return {
        ...state.Layout,
        RightSideModal: state.RightSideModal
    };
};
export default connect(mapStatetoProps, {
    changeSidebarTheme,
    changeSidebarType,
})(withRouter(Layout));

