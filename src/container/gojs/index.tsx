import React, { useState, useEffect } from 'react';
import * as go from 'gojs';
import Diagram from '../../components/goJs/canvas/diagram';
import { produce } from 'immer';
import img from "../../../assets/images/brand/vpc.png"
import CodeEditor from "../codeEditor";
import { connect } from "react-redux";



import "./styles.css";

interface AppState {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    selectedData: go.ObjectData | null;
    skipsDiagramUpdate: boolean;
    codeEditor: boolean;
    tempNodeData:Array<go.ObjectData>,
    tempLinkDataArray: Array<go.ObjectData>;
}

class Simple extends React.Component<any, AppState> {

    private mapNodeKeyIdx: Map<go.Key, number>;
    private mapLinkKeyIdx: Map<go.Key, number>;

    constructor(props: object) {
        super(props);
        this.state = {
            nodeDataArray: [
                
            ],
            linkDataArray: [
                
            ],
            modelData: {
                canRelink: true
            },
            selectedData: null,
            skipsDiagramUpdate: false,
            codeEditor: false,

            tempNodeData:[],
            tempLinkDataArray:[]


            // paletteData: [{ key: 1, text: 'Alpha', source="" }]
        }
        this.mapNodeKeyIdx = new Map<go.Key, number>();
        this.mapLinkKeyIdx = new Map<go.Key, number>();
        this.refreshNodeIndex(this.state.nodeDataArray);
        // this.refreshNodeIndex1(this.state.paletteData);
    }

    componentWillMount() {
        console.log(this.props.workspaceInitial)
        this.setState({
            nodeDataArray: this.props.workspaceInitial.canvasState, 
            tempNodeData:this.props.workspaceInitial.canvasState,
            linkDataArray:this.props.workspaceInitial.connections,
            tempLinkDataArray:this.props.workspaceInitial.connections
        })
    }

    componentDidUpdate(prev:any){
        if(prev.diagram.canvasProperties &&(prev.diagram.canvasProperties != this.props.diagram.canvasProperties)){
            this.props.saveState(this.state.tempNodeData, this.state.tempLinkDataArray, this.props.diagram.canvasProperties)
        }
    }

    refreshNodeIndex =(nodeArr: Array<go.ObjectData>) =>{
        this.mapNodeKeyIdx.clear();
        nodeArr.forEach((n: go.ObjectData, idx: number) => {
            this.mapNodeKeyIdx.set(n.key, idx);
        });
    }
    

    handleDiagramEvent = (e: any) => {
        // console.log(e.data);
        const name = e.name;
        // console.log(name, "adsad");
        // console.log(e.subject, e.name, e.subject.first().lb);
        // switch (name) {
        //     case 'ChangedSelection': {
        //         const sel = e.subject.first();
        //         this.setState(
        //             produce((draft: AppState) => {
        //                 if (sel) {
        //                     if (sel instanceof go.Node) {
        //                         const idx = this.mapNodeKeyIdx.get(sel.key);
        //                         if (idx !== undefined && idx >= 0) {
        //                             const nd = draft.nodeDataArray[idx];
        //                             draft.selectedData = nd;
        //                         }
        //                     } else if (sel instanceof go.Link) {
        //                         const idx = this.mapLinkKeyIdx.get(sel.key);
        //                         if (idx !== undefined && idx >= 0) {
        //                             const ld = draft.linkDataArray[idx];
        //                             draft.selectedData = ld;
        //                         }
        //                     }
        //                 } else {
        //                     draft.selectedData = null;
        //                 }
        //             })
        //         );
        //         break;
        //     }
        //     default: break;
        // }
    }


    handleModelChange = (obj: any) => {
        // console.log(obj);
        let data = JSON.parse(obj)
        // console.log(data.nodeDataArray, data.linkDataArray, this.props.diagram.canvasProperties)
        this.props.saveState(data.nodeDataArray, data.linkDataArray, this.props.diagram.canvasProperties)
        this.setState({tempNodeData:data.nodeDataArray, tempLinkDataArray: data.linkDataArray})


        // let _nodeDataArray = [...this.state.nodeDataArray];
        // produce((draft: AppState) => {

        // })
        // _nodeDataArray.push({
        //     "key": 4, "name": "Subnet", "loc": "384 319",
        //     "leftArray": [{ "portColor": "#66d6d1", "portId": "left0" }, { "portColor": "#fadfe5", "portId": "left1" }, { "portColor": "#6cafdb", "portId": "left2" }],
        //     "topArray": [{ "portColor": "#66d6d1", "portId": "top0" }],
        //     "bottomArray": [{ "portColor": "#6cafdb", "portId": "bottom0" }],
        //     "rightArray": []
        // })
        // this.setState({nodeDataArray:_nodeDataArray})

    }

    handleCodeEditor = () => {
        this.setState(
            produce((draft: AppState) => {
                draft.codeEditor = !draft.codeEditor;
            })
        )
    }

    updateDiagram = (e:any) =>{
        // console.log(e);
        // let data = JSON.parse(e)
        // console.log(data.nodeDataArray, data.linkDataArray)
        // if(data.nodeDataArray.length > 0){
        //     this.setState({nodeDataArray:data.nodeDataArray})
        // }
        // if(data.linkDataArray.length > 0){
        //     this.setState({linkDataArray:data.linkDataArray})
        // }

        
    }

    onComponentClick = (e:any) =>{
        // console.log(e.data);
        this.props.getRightBarContent(e)
    }

    render() {
        console.log(this.state)
        return (
            <>
                <Diagram
                    nodeDataArray={this.state.nodeDataArray}
                    linkDataArray={this.state.linkDataArray}
                    modelData={this.state.modelData}
                    skipsDiagramUpdate={this.state.skipsDiagramUpdate}
                    onDiagramEvent={this.updateDiagram}
                    onComponentClick={this.onComponentClick}
                    onModelChange={this.handleModelChange}
                    handleCodeEditor={this.handleCodeEditor}
                    codeEditor={this.state.codeEditor}

                    allPalettes={this.props.allPalettes}
                    workspaceData={this.props.workspaceData}

                    saveCanvas={this.props.saveCanvas}
                    validateCanvas={this.props.validateCanvas}
                    planCanvas={this.props.planCanvas}
                    applyCanvas={this.props.applyCanvas}
                />
                {
                    this.state.codeEditor
                        ?
                        <CodeEditor
                            overlay={this.state.codeEditor}
                            handleOverlay={this.handleCodeEditor}

                            folders={this.props.folders}
                            getCodeEditorData={this.props.getCodeEditorData}
                            code={this.props.code}
                        />
                        : null
                }
            </>
        )
    }
}

const mapStateToProps = (state:any) => {
	return {
		diagram: state.Diagram,
	};
};


export default connect(mapStateToProps, null)(Simple);