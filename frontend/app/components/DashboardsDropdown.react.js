import React, { Component, PropTypes } from 'react';
import _ from "underscore";
import cx from "classnames";
import OnClickOut from 'react-onclickout';

import CreateDashboardModal from "metabase/components/CreateDashboardModal.react";
import Modal from "metabase/components/Modal.react";


export default class DashboardsDropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            modalOpen: false
        };

        this.styles = {
            dashIcon: {
                width: '101px',
                height: '85px',
                backgroundImage: 'url("/app/components/icons/assets/dash_empty_state.svg")'
            }
        }

        _.bindAll(this, "toggleDropdown", "closeDropdown", "toggleModal", "closeModal");
    }

    onCreateDashboard(newDashboard) {
        let { createDashboardFn } = this.props;

        createDashboardFn(newDashboard).then(function() {
            // close modal and add new dash to our dashboards list
            this.setState({
                dropdownOpen: false,
                modalOpen: false
            });
        }.bind(this));
    }

    toggleModal() {
        if (!this.state.modalOpen) {
            // when we open our modal we always close the dropdown
            this.setState({
                dropdownOpen: false,
                modalOpen: !this.state.modalOpen
            });
        }
    }

    closeModal() {
        this.setState({ modalOpen: false });
    }

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    closeDropdown() {
        this.setState({ dropdownOpen: false });
    }

    renderCreateDashboardModal() {
        return (
            <Modal>
                <CreateDashboardModal
                    createDashboardFn={this.onCreateDashboard.bind(this)}
                    closeFn={this.closeModal} />
            </Modal>
        );
    }

    render() {
        let { children, dashboards } = this.props;
        let { dropdownOpen, modalOpen } = this.state;

        return (
            <div>
                { modalOpen ? this.renderCreateDashboardModal() : null }

                <OnClickOut onClickOut={this.closeDropdown}>
                    <div className={cx('NavDropdown inline-block cursor-pointer', { 'open': dropdownOpen })}>
                        <a onClick={this.toggleDropdown}>
                            {children}
                        </a>

                        { dropdownOpen ?
                            <div className="NavDropdown-content DashboardList NavDropdown-content--dashboards">
                                { dashboards.length === 0 ?
                                    <div className="NavDropdown-content-layer text-white text-centered">
                                        <div className="p2"><div style={this.styles.dashIcon} className="ml-auto mr-auto"></div></div>
                                        <div className="px2 py1 text-bold">You don’t have any dashboards yet.</div>
                                        <div className="px2 pb2 text-light">Dashboards group visualizations for frequent questions in a single handy place.</div>
                                        <div className="border-top border-light">
                                            <a className="Dropdown-item block text-white no-decoration" href="#" onClick={this.toggleModal}>Create your first dashboard</a>
                                        </div>
                                    </div>
                                :
                                    <ul className="NavDropdown-content-layer">
                                        { dashboards.map(dash =>
                                            <li className="block">
                                                <a className="Dropdown-item block text-white no-decoration" href={"/dash/"+dash.id} onClick={this.closeDropdown}>
                                                    <div className="flex text-bold">
                                                        {dash.name}
                                                    </div>
                                                    { dash.description ?
                                                        <div className="mt1 text-light text-brand-light">
                                                            {dash.description}
                                                        </div>
                                                    : null }
                                                </a>
                                            </li>
                                        )}
                                        <li className="block border-top border-light">
                                            <a className="Dropdown-item block text-white no-decoration" href="#" onClick={this.toggleModal}>Create a new dashboard</a>
                                        </li>
                                    </ul>
                                }
                            </div>
                        : null }
                    </div>
                </OnClickOut>
            </div>
        );
    }
}

DashboardsDropdown.propTypes = {
    createDashboardFn: PropTypes.func.isRequired,
    dashboards: PropTypes.array.isRequired
};
