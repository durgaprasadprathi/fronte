import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { TSCustomNodeModel } from './TSCustomNodeModel';
import img from "../../../assets/images/brand/vpc1.png";
import "./styles.css";
export interface TSCustomNodeWidgetProps {
	node: TSCustomNodeModel;
	engine: DiagramEngine;
}

export interface TSCustomNodeWidgetState { }

export class TSCustomNodeWidget extends React.Component<TSCustomNodeWidgetProps, TSCustomNodeWidgetState> {
	constructor(props: TSCustomNodeWidgetProps) {
		super(props);
		this.state = {};
	}


	render() {

		console.log(this.props)
		return (
			<div className="custom-node">
				{
					this.props.node.image
						?
						<div style={{ backgroundImage: "url(" + this.props.node.image + ")" }} className="custom-image" >
						</div>
						: null
				}
				{
					this.props.node.name
						?
						<div className="custom-name">
							{this.props.node.name}
						</div>
						: null
				}




				<div className="custom-outlet-left">
					<PortWidget engine={this.props.engine} port={this.props.node.getPort('in')}>
						<div className="circle-port-in" />
					</PortWidget>
					<PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
						<div className="circle-port-out" />
					</PortWidget>
				</div>
				{/* <br />

				<br />


				<div className="custom-outlet">
					<PortWidget engine={this.props.engine} port={this.props.node.getPort('in1')}>
						<div className="circle-port-in" />
					</PortWidget>
					<PortWidget engine={this.props.engine} port={this.props.node.getPort('out1')}>
						<div className="circle-port-out" />
					</PortWidget>
				</div> */}

				<div className="custom-node-color" style={{ backgroundColor: this.props.node.color }} />
			</div>
		);
	}
}
