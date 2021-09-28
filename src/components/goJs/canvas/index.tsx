import React, { useState, useEffect } from 'react';
import * as go from 'gojs';
import Diagram from './diagram';
import { produce } from 'immer';
import img from "../../../assets/images/brand/vpc.png"

import "./styles.css";

interface AppState {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    selectedData: go.ObjectData | null;
    skipsDiagramUpdate: boolean;
}

class Simple extends React.Component<{}, AppState> {

    private mapNodeKeyIdx: Map<go.Key, number>;
    private mapLinkKeyIdx: Map<go.Key, number>;

    constructor(props: object) {
        super(props);
        this.state = {
            nodeDataArray: [
                // { key: 1, text: "VPC",color:'grey',figure: "RoundedRectangle", source: img },

                // { key: 4, text: "Subnet",color:'grey',figure: "RoundedRectangle", source: img },
                // { key: 5, text: "Subnet",color:'grey',figure: "RoundedRectangle", source: img, group: 7 },
                // { key: 6, text: "VPC",color:'grey',figure: "RoundedRectangle", source: img, group: 7 },
                // { key: 7, text: "Group1", color:'grey',figure: "RoundedRectangle",isGroup: true, horiz:true }
            ],
            linkDataArray: [

            ],
            modelData: {
                canRelink: true
            },
            selectedData: null,
            skipsDiagramUpdate: false,
            // paletteData: [{ key: 1, text: 'Alpha', source="" }]
        }
        this.mapNodeKeyIdx = new Map<go.Key, number>();
        this.mapLinkKeyIdx = new Map<go.Key, number>();
        this.refreshNodeIndex(this.state.nodeDataArray);
        // this.refreshNodeIndex1(this.state.paletteData);
    }

    private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
        this.mapNodeKeyIdx.clear();
        nodeArr.forEach((n: go.ObjectData, idx: number) => {
            this.mapNodeKeyIdx.set(n.key, idx);
        });
    }

    public handleDiagramEvent(e: any) {
        console.log(e.data);
        const name = e.name;
        // console.log(e.subject,e.name, e.subject.first().lb);
        switch (name) {
            case 'ChangedSelection': {
                const sel = e.subject.first();
                this.setState(
                    produce((draft: AppState) => {
                        if (sel) {
                            if (sel instanceof go.Node) {
                                const idx = this.mapNodeKeyIdx.get(sel.key);
                                if (idx !== undefined && idx >= 0) {
                                    const nd = draft.nodeDataArray[idx];
                                    draft.selectedData = nd;
                                }
                            } else if (sel instanceof go.Link) {
                                const idx = this.mapLinkKeyIdx.get(sel.key);
                                if (idx !== undefined && idx >= 0) {
                                    const ld = draft.linkDataArray[idx];
                                    draft.selectedData = ld;
                                }
                            }
                        } else {
                            draft.selectedData = null;
                        }
                    })
                );
                break;
            }
            default: break;
        }
    }


    public handleModelChange(obj: go.IncrementalData) {
        console.log(obj);
    }


    render() {
        return (
            <>
                <Diagram
                    nodeDataArray={this.state.nodeDataArray}
                    linkDataArray={this.state.linkDataArray}
                    modelData={this.state.modelData}
                    skipsDiagramUpdate={this.state.skipsDiagramUpdate}
                    onDiagramEvent={this.handleDiagramEvent}
                    onModelChange={this.handleModelChange}
                />
            </>
        )
    }
}
export default Simple;