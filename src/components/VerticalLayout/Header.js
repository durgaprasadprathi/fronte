import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
//Import i18n
import { withNamespaces } from "react-i18next";


// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";


//Import logo Images
import logosmdark from "../../assets/images/logo-sm-dark.png";
import logodark from "../../assets/images/logo-dark.png";
import logosmlight from "../../assets/images/logo-sm-light.png";
import logolight from "../../assets/images/logo-light.png";

//Import Social Profile Images
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    /**
     * Toggle sidebar
     */
    toggleMenu = () => {
        this.props.toggleMenuCallback();
    }

  
   


    

    render() {
        return (
            <>
                <header id="page-topbar" style={this.props.style}>
                    <div className="navbar-header">
                        <div className="d-flex">
                            <div className="navbar-brand-box">
                                
                                <Link to="#" className="logo logo-light">
                                    {/* <span className="logo-sm">
                                        <img src={logosmlight} alt="" height="22" />
                                    </span> */}
                                    <span className="logo-lg">
                                        <img src={logolight} alt="" height="30" />
                                    </span>
                                </Link>
                            </div>
                            <Button size="sm" color="none" type="button" onClick={this.toggleMenu} className="px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn">
                                <i className="ri-menu-2-line align-middle"></i>
                            </Button>
                        </div>
                        <div className="d-flex">
                            
                            {/* <NotificationDropdown /> */}

                            <ProfileMenu />
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

const mapStatetoProps = state => {
    const { layoutType } = state.Layout;
    return { layoutType };
};

export default connect(mapStatetoProps, null)(withNamespaces()(Header));
