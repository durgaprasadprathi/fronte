import React, { useState, useEffect } from 'react';
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import Menu from "../../UI/menu";
import MenuItem from "../../UI/menuItems";
import { CustomLink } from "./link";
import "./styles.css";


interface DiagramProps {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    skipsDiagramUpdate: boolean;
    onDiagramEvent: (e: any) => void;
    onModelChange: (e: any) => void;
    handleCodeEditor: (e: any) => void;
    codeEditor:any,
    allPalettes:any
}

let myDiagram: any;
class Diagram extends React.Component<any, any> {

    private diagramRef: React.RefObject<ReactDiagram>;
    private paletteRef: React.RefObject<ReactPalette>;


    constructor(props: DiagramProps) {
        super(props);
        this.state = {
            selectedMenu: ""
        }
        this.diagramRef = React.createRef();
        this.paletteRef = React.createRef();

        // this.loadDiagramProperties = this.loadDiagramProperties.bind(this);
        this.callDiagramFunction = this.callDiagramFunction.bind(this);
    }

    loadFn = (a: string) => {
        console.log(a);
        // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        // this.loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
    }

    public componentDidMount() {
        if (!this.diagramRef.current) return;
        const diagram = this.diagramRef.current.getDiagram();
        if (diagram instanceof go.Diagram) {
            console.log("asdsad")
            // diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);

        }
    }

    public componentWillUnmount() {
        if (!this.diagramRef.current) return;
        const diagram = this.diagramRef.current.getDiagram();
        if (diagram instanceof go.Diagram) {
            console.log("asdsad")
            // diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
            // diagram.addDiagramListener('ObjectDoubleClicked', this.props.onDiagramEvent);
        }
    }

    public callDiagramFunction = (a: any) => {
        // console.log(myDiagram.model.toJson())
        this.props.onDiagramEvent(myDiagram.model.toJson());

        // console.log(myDiagram.model.toJson())
    }

    public onComponentClick = (a:any) =>{
        this.props.onComponentClick(a)
    }

    private initDiagram(onComponentClick: any, callDiagramFunction:any): go.Diagram {

        var $ = go.GraphObject.make;
        myDiagram =
            $(go.Diagram,
                {
                    grid: $(go.Panel, "Grid",
                        $(go.Shape, "LineH", { stroke: "#e0e0e0", strokeWidth: 0.5 }),
                        $(go.Shape, "LineH", { stroke: "#adadad", strokeWidth: 0.5, interval: 30 }),
                        $(go.Shape, "LineV", { stroke: "#e0e0e0", strokeWidth: 0.5 }),
                        $(go.Shape, "LineV", { stroke: "#adadad", strokeWidth: 0.5, interval: 30 })
                    ),
                    "undoManager.isEnabled": false,
                    "draggingTool.dragsLink": true,
                    "draggingTool.isGridSnapEnabled": true,
                    "linkingTool.isUnconnectedLinkValid": true,
                    "linkingTool.portGravity": 20,
                    "relinkingTool.isUnconnectedLinkValid": true,
                    "relinkingTool.portGravity": 20,

                });

        myDiagram.addDiagramListener("Modified", function (e:any) {
           callDiagramFunction(myDiagram.model.toJson())
        });
        myDiagram.addDiagramListener("AnimationStarting", function (e: any) {
            console.log("asdsadsa1111111111");
            // callDiagramFn(e);
        });

        // myDiagram.addDiagramListener("ObjectSingleClicked", function (e: any) {
        //     console.log(e.diagram, "asdsadsa");
        // });


        function makeButton(text: any, action: any, visiblePredicate: any) {
            return $("ContextMenuButton",
                $(go.TextBlock, text),
                { click: action },
                // don't bother with binding GraphObject.visible if there's no predicate
                visiblePredicate ? new go.Binding("visible", "", function (o, e) { return o.diagram ? visiblePredicate(o, e) : false; }).ofObject() : {});
        }

        function addPort(side: any) {
            myDiagram.startTransaction("addPort");
            myDiagram.selection.each(function (node: any) {
                // skip any selected Links
                if (!(node instanceof go.Node)) return;
                // compute the next available index number for the side
                var i = 0;
                while (node.findPort(side + i.toString()) !== node) i++;
                // now this new port name is unique within the whole Node because of the side prefix
                var name = side + i.toString();
                // get the Array of port data to be modified
                var arr = node.data[side + "Array"];
                if (arr) {
                    // create a new port data object
                    var newportdata = {
                        portId: name,
                        portColor: getPortColor()
                    };
                    // and add it to the Array of port data
                    myDiagram.model.insertArrayItem(arr, -1, newportdata);
                }
            });
            myDiagram.commitTransaction("addPort");
        }

        function getPortColor() {
            var portColors = ["#fae3d7", "#d6effc", "#ebe3fc", "#eaeef8", "#fadfe5", "#6cafdb", "#66d6d1"]
            return portColors[Math.floor(Math.random() * portColors.length)];
        }


        var nodeMenu =  // context menu for each Node
            $("ContextMenu",
                makeButton("Copy",
                    function (e: any, obj: any) { e.diagram.commandHandler.copySelection(); }, null),
                makeButton("Delete",
                    function (e: any, obj: any) { e.diagram.commandHandler.deleteSelection(); }, null),
                $(go.Shape, "LineH", { strokeWidth: 2, height: 1, stretch: go.GraphObject.Horizontal }),
                makeButton("Add top port",
                    function (e: any, obj: any) { addPort("top"); }, null),
                makeButton("Add left port",
                    function (e: any, obj: any) { addPort("left"); }, null),
                makeButton("Add right port",
                    function (e: any, obj: any) { addPort("right"); }, null),
                makeButton("Add bottom port",
                    function (e: any, obj: any) { addPort("bottom"); }, null)
            );

        function removePort(port: any) {
            myDiagram.startTransaction("removePort");
            var pid = port.portId;
            var arr = port.panel.itemArray;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].portId === pid) {
                    myDiagram.model.removeArrayItem(arr, i);
                    break;
                }
            }
            myDiagram.commitTransaction("removePort");
        }

        function changeColor(port: any) {
            myDiagram.startTransaction("colorPort");
            var data = port.data;
            myDiagram.model.setDataProperty(data, "portColor", getPortColor());
            myDiagram.commitTransaction("colorPort");
        }

        function removeAll(port: any) {
            myDiagram.startTransaction("removePorts");
            var nodedata = port.part.data;
            var side = port._side;  // there are four property names, all ending in "Array"
            myDiagram.model.setDataProperty(nodedata, side + "Array", []);  // an empty Array
            myDiagram.commitTransaction("removePorts");
        }

        // go.Diagram.inherit(CustomLink, go.Link);


        var portMenu =  // context menu for each port
            $("ContextMenu",
                makeButton("Swap order",
                    function (e: any, obj: any) { swapOrder(obj.part.adornedObject); }, null),
                makeButton("Remove port",
                    // in the click event handler, the obj.part is the Adornment;
                    // its adornedObject is the port
                    function (e: any, obj: any) { removePort(obj.part.adornedObject); }, null),
                makeButton("Change color",
                    function (e: any, obj: any) { changeColor(obj.part.adornedObject); }, null),
                makeButton("Remove side ports",
                    function (e: any, obj: any) { removeAll(obj.part.adornedObject); }, null)
            );

        function swapOrder(port: any) {
            var arr = port.panel.itemArray;
            if (arr.length >= 2) {  // only if there are at least two ports!
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].portId === port.portId) {
                        myDiagram.startTransaction("swap ports");
                        if (i >= arr.length - 1) i--;  // now can swap I and I+1, even if it's the last port
                        var newarr = arr.slice(0);  // copy Array
                        newarr[i] = arr[i + 1];  // swap items
                        newarr[i + 1] = arr[i];
                        // remember the new Array in the model
                        myDiagram.model.setDataProperty(port.part.data, port._side + "Array", newarr);
                        myDiagram.commitTransaction("swap ports");
                        break;
                    }
                }
            }
        }

        var portSize = new go.Size(8, 8);

        var sharedToolTipPort =
            $(go.Adornment, "Auto",
                $(go.Shape, "RoundedRectangle", { fill: "lightyellow" }),
                $(go.TextBlock, { margin: 2 },
                    new go.Binding("text", "", function (d) { return d.portTitle; })));

        myDiagram.nodeTemplate =
            $(go.Node, "Table",
                {
                    locationObjectName: "BODY",
                    locationSpot: go.Spot.Center,
                    selectionObjectName: "BODY",
                    contextMenu: nodeMenu
                },
                {
                    click: function (e: any, node: any) {
                        // this.props.handleDiagramEvent(node)
                        onComponentClick(node);
                        // console.log(node.data)
                    },
                    actionUp:function (e: any) {
                        // this.props.handleDiagramEvent(node)
                        // callDiagramFn(node);
                        console.log("sdsd")
                    },
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

                // the body
                $(go.Panel, "Auto",
                    {
                        row: 1, column: 1, name: "BODY",
                        stretch: go.GraphObject.Fill
                    },
                    $(go.Shape, "Rectangle",
                        {
                            fill: "#dbf6cb", stroke: null, strokeWidth: 0,
                            minSize: new go.Size(100, 50)
                        }),
                    $(go.TextBlock,
                        { margin: 10, textAlign: "center", font: "bold 14px Segoe UI,sans-serif", stroke: "#484848", editable: true },
                        new go.Binding("text", "name").makeTwoWay())
                ),  // end Auto Panel body

                // the Panel holding the left port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.leftArray
                $(go.Panel, "Vertical",
                    new go.Binding("itemArray", "leftArray"),
                    {
                        row: 1, column: 0,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "left",  // internal property to make it easier to tell which side it's on
                                    fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer",
                                    contextMenu: portMenu
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Circle",
                                    {
                                        stroke: null, strokeWidth: 0,
                                        desiredSize: portSize,
                                        margin: new go.Margin(1, 0)
                                    },
                                    { toolTip: sharedToolTipPort },
                                    new go.Binding("fill", "portColor"))
                            ),  // end itemTemplate

                    }
                ),  // end Vertical Panel

                // the Panel holding the top port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.topArray
                $(go.Panel, "Horizontal",
                    new go.Binding("itemArray", "topArray"),
                    {
                        row: 0, column: 1,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "top",
                                    fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer",
                                    contextMenu: portMenu
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Circle",
                                    {
                                        stroke: null, strokeWidth: 0,
                                        desiredSize: portSize,
                                        margin: new go.Margin(0, 1)
                                    },
                                    { toolTip: sharedToolTipPort },
                                    new go.Binding("fill", "portColor"))
                            )  // end itemTemplate
                    }
                ),  // end Horizontal Panel

                // the Panel holding the right port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.rightArray
                $(go.Panel, "Vertical",
                    new go.Binding("itemArray", "rightArray"),
                    {
                        row: 1, column: 2,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "right",
                                    fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer",
                                    contextMenu: portMenu
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Circle",
                                    {
                                        stroke: null, strokeWidth: 0,
                                        desiredSize: portSize,
                                        margin: new go.Margin(1, 0)
                                    },
                                    { toolTip: sharedToolTipPort },
                                    new go.Binding("fill", "portColor"))
                            )  // end itemTemplate
                    }
                ),  // end Vertical Panel

                // the Panel holding the bottom port elements, which are themselves Panels,
                // created for each item in the itemArray, bound to data.bottomArray
                $(go.Panel, "Horizontal",
                    new go.Binding("itemArray", "bottomArray"),
                    {
                        row: 2, column: 1,
                        itemTemplate:
                            $(go.Panel,
                                {
                                    _side: "bottom",
                                    fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                                    fromLinkable: true, toLinkable: true, cursor: "pointer",
                                    contextMenu: portMenu
                                },
                                new go.Binding("portId", "portId"),
                                $(go.Shape, "Circle",
                                    {
                                        stroke: null, strokeWidth: 0,
                                        desiredSize: portSize,
                                        margin: new go.Margin(0, 1)
                                    },
                                    { toolTip: sharedToolTipPort },
                                    new go.Binding("fill", "portColor"))
                            )  // end itemTemplate
                    }
                )  // end Horizontal Panel
            );  // end Node

        myDiagram.linkTemplate =
            $(CustomLink,  // defined below
                {
                    routing: go.Link.AvoidsNodes,
                    corner: 4,
                    curve: go.Link.JumpGap,
                    reshapable: true,
                    resegmentable: true,
                    relinkableFrom: true,
                    relinkableTo: true
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 2 })
            );

        myDiagram.toolManager.clickCreatingTool.archetypeNodeData = {
            name: "Unit",
            leftArray: [],
            rightArray: [],
            topArray: [],
            bottomArray: []
        };

        myDiagram.contextMenu =
            $("ContextMenu",
                makeButton("Paste",
                    function (e: any, obj: any) { e.diagram.commandHandler.pasteSelection(e.diagram.toolManager.contextMenuTool.mouseDownPoint); },
                    function (o: any) { return o.diagram.commandHandler.canPasteSelection(o.diagram.toolManager.contextMenuTool.mouseDownPoint); }),
                makeButton("Undo",
                    function (e: any, obj: any) { e.diagram.commandHandler.undo(); },
                    function (o: any) { return o.diagram.commandHandler.canUndo(); }),
                makeButton("Redo",
                    function (e: any, obj: any) { e.diagram.commandHandler.redo(); },
                    function (o: any) { return o.diagram.commandHandler.canRedo(); })
            );

        function highlightGroup(e: any, grp: any, show: any) {
            if (!grp) return;
            e.handled = true;
            if (show) {
                // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
                // instead depend on the DraggingTool.draggedParts or .copiedParts
                var tool = grp.diagram.toolManager.draggingTool;
                var map = tool.draggedParts || tool.copiedParts;  // this is a Map
                // now we can check to see if the Group will accept membership of the dragged Parts
                if (grp.canAddMembers(map.toKeySet())) {
                    grp.isHighlighted = true;
                    return;
                }
            }
            grp.isHighlighted = false;
        }

        function finishDrop(e: any, grp: any) {
            var ok = (grp !== null
                ? grp.addMembers(grp.diagram.selection, true)
                : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
            if (!ok) e.diagram.currentTool.doCancel();
        }

        function makeLayout(horiz: any) {  // a Binding conversion function
            if (horiz) {
                return $(go.GridLayout,
                    {
                        wrappingWidth: Infinity, alignment: go.GridLayout.Position,
                        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
                    });
            } else {
                return $(go.GridLayout,
                    {
                        wrappingColumn: 1, alignment: go.GridLayout.Position,
                        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
                    });
            }
        }

        function defaultColor(horiz: any) {  // a Binding conversion function
            return horiz ? "#FFDD33" : "#33D3E5";
        }

        function defaultFont(horiz: any) {  // a Binding conversion function
            return horiz ? "bold 18px sans-serif" : "bold 16px sans-serif";
        }

        myDiagram.groupTemplate =
            $(go.Group, "Auto",
                {
                    background: "transparent",
                    ungroupable: true,
                    // highlight when dragging into the Group
                    mouseDragEnter: function (e, grp, prev) { highlightGroup(e, grp, true); },
                    mouseDragLeave: function (e, grp, next) { highlightGroup(e, grp, false); },
                    computesBoundsAfterDrag: true,
                    // when the selection is dropped into a Group, add the selected Parts into that Group;
                    // if it fails, cancel the tool, rolling back any changes
                    mouseDrop: finishDrop,
                    handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                    // Groups containing Groups lay out their members horizontally
                    layout: makeLayout(false)
                },
                new go.Binding("layout", "horiz", makeLayout),
                new go.Binding("background", "isHighlighted", function (h) {
                    return h ? "rgba(255,0,0,0.2)" : "transparent";
                }).ofObject(),
                $(go.Shape, "Rectangle",
                    { fill: null, stroke: defaultColor(false), strokeWidth: 2 },
                    new go.Binding("stroke", "horiz", defaultColor),
                    new go.Binding("stroke", "color")),
                $(go.Panel, "Vertical",  // title above Placeholder
                    $(go.Panel, "Horizontal",  // button next to TextBlock
                        { stretch: go.GraphObject.Horizontal, background: defaultColor(false) },
                        new go.Binding("background", "horiz", defaultColor),
                        new go.Binding("background", "color"),
                        $("SubGraphExpanderButton",
                            { alignment: go.Spot.Right, margin: 5 }),
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Left,
                                editable: true,
                                margin: 5,
                                font: defaultFont(false),
                                opacity: 0.75,  // allow some color to show through
                                stroke: "#404040"
                            },
                            new go.Binding("font", "horiz", defaultFont),
                            new go.Binding("text", "text").makeTwoWay())
                    ),  // end Horizontal Panel
                    $(go.Placeholder,
                        { padding: 20, alignment: go.Spot.Right })
                )  // end Vertical Panel
            );
        myDiagram.model = new go.GraphLinksModel();
        myDiagram.model.linkFromPortIdProperty = "fromPort";
        myDiagram.model.linkToPortIdProperty = "toPort";

        return myDiagram;
    }

    handleSelectedMenu = (name: string) => {
        console.log(this.state)
        this.setState({ selectedMenu: this.state.selectedMenu === name ? "" : name })
    }



    private initPalette(): go.Palette {
        var $ = go.GraphObject.make;
        console.log("sddsds")
        let myPalette =
            $(go.Palette,  // must name or refer to the DIV HTML element
                {
                    maxSelectionCount: 1,
                    // groupTemplateMap: myDiagram.groupTemplateMap,
                    // share the templates used by myDiagram
                    linkTemplate: // simplify the link template, just in this Palette
                        $(go.Link,
                            { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
                                // to line up the Link in the same manner we have to pretend the Link has the same location spot
                                locationSpot: go.Spot.Center,
                                selectionAdornmentTemplate:
                                    $(go.Adornment, "Link",
                                        { locationSpot: go.Spot.Center },
                                        $(go.Shape,
                                            { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                                        $(go.Shape,  // the arrowhead
                                            { toArrow: "Standard", stroke: null })
                                    )
                            },
                            {
                                routing: go.Link.AvoidsNodes,
                                curve: go.Link.JumpOver,
                                corner: 5,
                                toShortLength: 4
                            },
                            new go.Binding("points"),
                            $(go.Shape,  // the link path shape
                                { isPanelMain: true, strokeWidth: 2 }),
                            $(go.Shape,  // the arrowhead
                                { toArrow: "Standard", stroke: null })
                        ),

                });
        myPalette.nodeTemplate =
            $(go.Node, "Auto",
                { alignment: go.Spot.TopLeft },
                // $(go.Shape,
                //     { width: 14, height: 14, fill: "white" },
                //     new go.Binding("fill", "color")),
                $(go.Shape, { strokeWidth: 0, fill: "#f1f1f1" }),
                $(go.TextBlock,
                    { margin: 0, width: 130, font: "normal small-caps 900 15px Sans, Serif", background: "#f1f1f1", textAlign: "left" },
                    new go.Binding("text", "name"))
            );

        myPalette.groupTemplate =
            $(go.Group, "Auto",
                { alignment: go.Spot.TopLeft },
                // $(go.Shape,
                //     { width: 14, height: 14, fill: "white" },
                //     new go.Binding("fill", "color")),
                $(go.Shape, { strokeWidth: 0, fill: "lightblue" }),
                $(go.TextBlock,
                    { margin: 4, width: 150, font: "normal small-caps 900 15px Sans, Serif", background: "lightblue", textAlign: "start" },
                    new go.Binding("text", "text"))
            );
        // myPalette.model.nodeKeyProperty = myDiagram.model.nodeKeyProperty;
        myPalette.model = new go.GraphLinksModel([]);
        // myPalette.model.linkFromPortIdProperty = "fromPort";
        // myPalette.model.linkToPortIdProperty = "toPort";
        


        return myPalette;

    }




    render() {
        return (
            <>
                <div className="diagram-area">
                    <ReactDiagram
                        ref={this.diagramRef}
                        divClassName='new-canvas'
                        initDiagram={() => { return this.initDiagram(this.onComponentClick, this.callDiagramFunction) }}
                        nodeDataArray={this.props.nodeDataArray}
                        linkDataArray={this.props.linkDataArray}
                        modelData={this.props.modelData}
                        onModelChange={() => this.props.onModelChange(myDiagram)}
                        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
                    />
                    <div className="palette-section">
                        <div className="diagram-information">
                            <div className="row">
                                <div className="col-md-12 mt-2 mb-2">
                                    <select
                                        className="form-control"
                                    >
                                        <option>Region</option>
                                        <option>us-east</option>
                                        <option>us-west</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <select
                                        className="form-control"
                                    >
                                        <option>Organization Account</option>
                                        <option>Account A</option>
                                        <option>Account b</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mb-2">
                                    <select
                                        className="form-control"
                                    >
                                        <option>Platform List</option>
                                        <option>AWS</option>
                                        <option>Azure</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="palette-information">
                            <input
                                // onChange={this.handleSearch}
                                className="application-search"
                                // value={this.state.searchItem}
                                placeholder="Search"
                            />
                            {this.props.allPalettes && this.props.allPalettes.map((p: any, i: any) => {
                                return <>
                                    <Menu
                                        title={p.name}
                                        onClick={() => this.handleSelectedMenu(p.name)}
                                        active={this.state.selectedMenu === p.name ? true : false}
                                    />
                                    {
                                        this.state.selectedMenu === p.name
                                            ?
                                            <ReactPalette
                                                initPalette={this.initPalette}
                                                divClassName='palette-component'
                                                nodeDataArray={p.children}
                                            />
                                            : null
                                    }
                                </>
                            })}
                        </div>
                        <div className="button-information">
                            <button
                                className="diagram-button"
                                onClick={() => this.props.handleCodeEditor()}
                                title="Publish"
                            >
                                <i className="ri-check-double-line"></i>
                            </button>

                            <button
                                className="diagram-button"
                                // onClick={() => this.props.handleCodeEditor()}
                                title="Code Editor"
                            >
                                <i className="ri-code-line"></i>
                            </button>
                            <button
                                className="diagram-button"
                                // onClick={() => this.props.handleCodeEditor()}
                                title="Save"
                            >
                                <i className="ri-save-fill"></i>
                            </button>
                        </div>


                    </div>

                </div>

            </>
        )
    }
}


export default Diagram;