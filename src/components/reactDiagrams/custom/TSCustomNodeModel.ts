import { NodeModel, DefaultPortModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface TSCustomNodeModelOptions extends BaseModelOptions {
	color?: string;
	image?: string;
	name?: string;
}

export class TSCustomNodeModel extends NodeModel {
	color: string;
	image: string;
	name: string;

	constructor(options: TSCustomNodeModelOptions = {}) {
		super({
			...options,
			type: 'ts-custom-node'
		});
		this.color = options.color || 'red';
		this.image = options.image || '';
		this.name = options.name || '';

		// setup an in and out port
		this.addPort(
			new DefaultPortModel({
				in: true,
				alignment:PortModelAlignment.TOP,
				name: 'in'
			})
		);
		this.addPort(
			new DefaultPortModel({
				in: false,
				alignment:PortModelAlignment.RIGHT,
				name: 'out'
			})
		);

		this.addPort(
			new DefaultPortModel({
				in: true,
				name: 'in1'
			})
		);

		this.addPort(
			new DefaultPortModel({
				in: false,
				name: 'out1'
			})
		);
	}

	serialize() {
		return {
			...super.serialize(),
			color: this.color,
			image: this.image,
			name: this.name,
		};
	}

	deserialize(event: any): void {
		super.deserialize(event);
		this.color = event.data.color;
		this.image = event.data.image;
		this.name = event.data.name;
	}
}
