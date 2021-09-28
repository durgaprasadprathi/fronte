import * as SRD from '@projectstorm/react-diagrams';
// import createEngine, { DefaultLinkModel, DiagramModel, DiagramEngine } from '@projectstorm/react-diagrams';
import { TSCustomNodeFactory } from './custom/TSCustomNodeFactory';
import { TSCustomNodeModel } from './custom/TSCustomNodeModel';
import img from "../../assets/images/brand/vpc1.png";


export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine:  SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = SRD.default();
		this.newModel();
	}

	public newModel() {

		this.activeModel = new SRD.DiagramModel();
		// register the two engines
		
		this.diagramEngine.getNodeFactories().registerFactory(new TSCustomNodeFactory());
		this.diagramEngine.setModel(this.activeModel);

		console.log(this.diagramEngine)

		

		//####################################################
		// now create two nodes of each type, and connect them

		const node1 = new TSCustomNodeModel({ color: 'rgb(0,192,255)', name: "Subnet", });
		node1.setPosition(50, 100);

		const node2 = new TSCustomNodeModel({ color: 'rgb(0,192,255)', image: img, });
		node2.setPosition(300, 50);

		const node3 = new TSCustomNodeModel({ color: 'rgb(0,192,255)', image: img, });
		node3.setPosition(150, 150);



		const link1 = new SRD.DefaultLinkModel();
		link1.setSourcePort(node1.getPort('out'));
		link1.setTargetPort(node2.getPort('in'));

		const link2 = new SRD.DefaultLinkModel();
		link2.setSourcePort(node2.getPort('out'));
		link2.setTargetPort(node3.getPort('in'));

		this.activeModel.addAll(node1, node2, link1, node3, link2);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}



// export class Application {
// 	protected activeModel: SRD.DiagramModel;
// 	protected diagramEngine: SRD.DiagramEngine;

// 	constructor() {
// 		this.diagramEngine = SRD.default();
// 		this.newModel();
// 	}

// 	public newModel() {
// 		this.activeModel = new SRD.DiagramModel();
// 		this.diagramEngine.setModel(this.activeModel);

// 		console.log(this.diagramEngine)

// 		//3-A) create a default node
// 		var node1 = new SRD.DefaultNodeModel("A", 'rgb(0,192,255)');
// 		let port = node1.addOutPort('Out');
// 		node1.addOutPort('ABC');
// 		node1.setPosition(100, 100);

// 		//3-B) create another default node
// 		var node2 = new SRD.DefaultNodeModel('Node 2', 'rgb(192,255,0)');
// 		let port2 = node2.addInPort('In');
// 		node2.setPosition(400, 100);

// 		// link the ports
// 		let link1 = port.link(port2);

// 		this.activeModel.addAll(node1, node2, link1);
// 	}

// 	public getActiveDiagram(): SRD.DiagramModel {
// 		return this.activeModel;
// 	}

// 	public getDiagramEngine(): SRD.DiagramEngine {
// 		return this.diagramEngine;
// 	}
// }
