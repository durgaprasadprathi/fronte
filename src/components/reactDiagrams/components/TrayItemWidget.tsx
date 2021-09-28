import * as React from 'react';
import styled from '@emotion/styled';

export interface TrayItemWidgetProps {
	model: any;
	color?: string;
	name: string;
}

namespace S {
	export const Tray = styled.div<{ color: string }>`
		color: #d5d0d0;
		font-family: Helvetica, Arial;
		border-radius: 5px;
		margin-bottom: 2px;
		cursor: pointer;
	`;
}

export class TrayItemWidget extends React.Component<TrayItemWidgetProps> {
	render() {
		return (
			<S.Tray
				color={this.props.color}
				draggable={true}
				onDragStart={(event) => {
					event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
				}}
				className="tray-item">
				{this.props.name}
			</S.Tray>
		);
	}
}
