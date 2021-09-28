import React, { Component } from "react";
// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
//i18n
import { withNamespaces } from 'react-i18next';
import { connect } from "react-redux";

import MenuTitle from "./SidebarComponent/menuTitle";
import MainMenu from "./SidebarComponent/mainMenu";
import ChildMenu from "./SidebarComponent/childMenu";


import Links from "../../routes/links.json";



class SidebarContent extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount() {
        this.initMenu();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {

            if (this.props.type !== prevProps.type) {
                this.initMenu();
            }

        }
    }

    initMenu() {
        new MetisMenu("#side-menu");

        var matchingMenuItem = null;
        var ul = document.getElementById("side-menu");
        var items = ul.getElementsByTagName("a");
        for (var i = 0; i < items.length; ++i) {
            if (this.props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }
    }

    activateParentDropdown = item => {
        item.classList.add("active");
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add("mm-active");
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");

                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add("mm-active"); // li
                    parent3.childNodes[0].classList.add("mm-active"); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add("mm-active");
                    }
                }
            }
            return false;
        }
        return false;
    };

    generateLinks = () => {
        let allLinks = [];
        Links && Links.map((l0, i) => {
            allLinks.push(
                <MenuTitle
                    key={i}
                    title={l0.heading}
                />
            )
            if (l0.children && l0.children.length > 0) {
                let _parent = []
                let _child = []
                l0.children.map((l1, j) => {
                    _parent = [];
                    _parent.push(
                        <MainMenu
                            data={l1}
                            key={j}
                            hasCaret={l1.children && l1.children.length > 0 ? true : false}
                        />
                    )
                    _child = [];
                    if (l1.children && l1.children.length > 0) {

                        l1.children.map((l2, k) => {
                            _child.push(
                                <ChildMenu
                                    data={l2}
                                    key={k}
                                />
                            )
                        })
                        // console.log(_child);

                        // allLinks.push(
                        // )

                    }
                    allLinks.push(
                        <li>{_parent}{(_child.length > 0 ? <ul className="sub-menu" >{_child}</ul> : "")}</li>
                    )
                })






            }
        })
        // console.log(allLinks);
        return allLinks;
    }

    render() {
        return (
            <>
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        {
                            this.generateLinks()
                        }
                    </ul>
                </div>
            </>
        );
    }
}

const mapStatetoProps = state => {
    return { ...state.Layout };
};

export default withRouter(connect(mapStatetoProps, null)(withNamespaces()(SidebarContent)));
