import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { Application } from '../Application';
import { TrayItemWidget } from './TrayItemWidget';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    updateRightSideModal
} from "../../../store/actions";

import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../../../diagramHelper/DemoCanvasWidget';
import Menu from "../../UI/menu";
import MenuItem from "../../UI/menuItems";
import { content } from "./menu";
import styled from '@emotion/styled';
import "./styles.css";
// import Metis from "./metis";




export interface BodyWidgetProps {
	app: Application;
}

namespace S {
	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 550px;
		margin-top: -24px;
		margin-left: -5px;
		margin-right: -15px;
	}
	`;

	export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;
}

class BodyWidget extends React.Component<any, any> {

	constructor(props: any){
		super(props);
		this.state={
			selectedMenu:"",
			searchItem:""
		}
	}


	generateMenu = () => {
		let allMenu:any = [];
		content && content.map((c: any, i: number) => {
			allMenu.push(
				<Menu
					title={c.label}
					onClick={() => this.handleSelectedMenu(c.label)}
				/>)
			if(c.label === this.state.selectedMenu){
				c.content.map((s: any, i: number) => {
					allMenu.push(
						<MenuItem
							title={s.label}
						>
							<TrayItemWidget model={{ type: 'in' }} name={s.label} color="rgb(192,255,0)" />
						</MenuItem>
						)
				})
			}
			
		})

		return allMenu;
	}

	handleSelectedMenu = (name: string) => {
		this.setState({selectedMenu: this.state.selectedMenu === name ? "": name})
		this.generateMenu();
	}

	handleSearch = (e: any) => {
		this.setState({searchItem: e.target.value})
	}

	render() {
		return (
			<S.Body>
				<S.Content>
					<TrayWidget>
						<input 
							onChange={this.handleSearch} 
							className="application-search"
							value={this.state.searchItem}
							placeholder="Search"
						/>
						{this.generateMenu()}
					</TrayWidget>
					<S.Layer
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;

							var node: any = null;
							if (data.type === 'in') {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
								node.addInPort('In');
							} else {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addOutPort('Out');
							}
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app.getDiagramEngine().getModel().addNode(node);
							this.forceUpdate();
						}}
						onClick={(e) => {
							console.log(e);
							this.props.updateRightSideModal(!this.props.RightSideModal.rightSideModal);
						}}
						onDragOver={(event) => {
							event.preventDefault();
						}}>
						<DemoCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</DemoCanvasWidget>
					</S.Layer>
				</S.Content>
			</S.Body>
		);
	}
}

const mapStateToProps = (state:any) => {
    return {
        RightSideModal: state.RightSideModal
    };
};


export default connect(mapStateToProps, { updateRightSideModal})(BodyWidget)

