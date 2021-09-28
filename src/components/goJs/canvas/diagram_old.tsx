import React, { useState, useEffect } from 'react';
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import Menu from "../../UI/menu";
import MenuItem from "../../UI/menuItems";
import "./styles.css";


interface DiagramProps {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    skipsDiagramUpdate: boolean;
    onDiagramEvent: (e: go.DiagramEvent) => void;
    onModelChange: (e: go.IncrementalData) => void;
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
        this.callDiagramFn = this.callDiagramFn.bind(this);
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
            // diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);

        }
    }

    public componentWillUnmount() {
        if (!this.diagramRef.current) return;
        const diagram = this.diagramRef.current.getDiagram();
        if (diagram instanceof go.Diagram) {
            // diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
            // diagram.addDiagramListener('ObjectDoubleClicked', this.props.onDiagramEvent);
        }
    }




    public callDiagramFn = (a: any) => {
        this.props.onDiagramEvent(a);
    }




    private initDiagram(callDiagramFn: any): go.Diagram {

        function loadFn(a: string) {
            console.log(a);
            // myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
            loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
        }


        function loadDiagramProperties() {
            // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
            var pos = myDiagram.model.modelData.position;
            if (pos) myDiagram.initialPosition = go.Point.parse(pos);
        }

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
                    "draggingTool.dragsLink": true,
                    "draggingTool.isGridSnapEnabled": true,
                    "linkingTool.isUnconnectedLinkValid": true,
                    "linkingTool.portGravity": 20,
                    "relinkingTool.isUnconnectedLinkValid": true,
                    "relinkingTool.portGravity": 20,
                    "relinkingTool.fromHandleArchetype":
                        $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
                    "relinkingTool.toHandleArchetype":
                        $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
                    "linkReshapingTool.handleArchetype":
                        $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
                    "rotatingTool.handleAngle": 270,
                    "rotatingTool.handleDistance": 30,
                    "rotatingTool.snapAngleMultiple": 15,
                    "rotatingTool.snapAngleEpsilon": 15,
                    "undoManager.isEnabled": true,
                    "clickCreatingTool.archetypeNodeData": { key: "Node", color: "white" },
                    // allow Ctrl-G to group selected nodes
                    "commandHandler.archetypeGroupData": { text: "Group", isGroup: true },
                    // have mouse wheel events zoom in and out instead of scroll up and down
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                });

        myDiagram.addDiagramListener("Modified", function (e: any) {
            console.log(e);
            // var button = document.getElementById("SaveButton");
            // if (button) button.disabled = !myDiagram.isModified;
            // var idx = document.title.indexOf("*");
            // if (myDiagram.isModified) {
            //     if (idx < 0) document.title += "*";
            // } else {
            //     if (idx >= 0) document.title = document.title.substr(0, idx);
            // }
        });
        var nodeSelectionAdornmentTemplate =
            $(go.Adornment, "Auto",
                $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
                $(go.Placeholder)
            );


        var nodeResizeAdornmentTemplate =
            $(go.Adornment, "Spot",
                { locationSpot: go.Spot.Right },
                $(go.Placeholder),
                $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
            );

        var nodeRotateAdornmentTemplate =
            $(go.Adornment,
                { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
                $(go.Shape, "Ellipse", { name: "ELLIPSE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
                $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
            );

        function makePort(name: any, spot: any, output: any, input: any) {
            // the port is basically just a small transparent circle
            return $(go.Shape, "Circle",
                {
                    fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                    stroke: null,
                    desiredSize: new go.Size(7, 7),
                    alignment: spot,  // align the port on the main Shape
                    alignmentFocus: spot,  // just inside the Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here,
                    cursor: "pointer"  // show a different cursor to indicate potential link point
                });
        }

        myDiagram.nodeTemplate =
            $(go.Node, "Spot",
                { locationSpot: go.Spot.Center },
                {
                    doubleClick: function (e, node: any) {
                        // this.props.handleDiagramEvent(node)
                        callDiagramFn(node);
                        // console.log(node.data)
                    }
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
                { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
                { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
                new go.Binding("angle").makeTwoWay(),
                // the main object is a Panel that surrounds a TextBlock with a Shape
                $(go.Panel, "Auto",
                    { name: "PANEL" },
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                    $(go.Shape, "Rectangle",  // default figure
                        {
                            portId: "", // the default port: if no spot on link data, use closest side
                            fromLinkable: true, toLinkable: true, cursor: "pointer",
                            fill: "white",  // default color
                            strokeWidth: 2
                        },
                        new go.Binding("figure"),
                        new go.Binding("fill")),
                    $(go.TextBlock,
                        {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            margin: 15,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                ),
                // four small named ports, one on each side:
                makePort("T", go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, false),
                { // handle mouse enter/leave events to show/hide the ports
                    mouseEnter: function (e, node) { showSmallPorts(node, true); },
                    mouseLeave: function (e, node) { showSmallPorts(node, false); }
                }
            );

        myDiagram.model.isReadOnly = true;
        function showSmallPorts(node: any, show: any) {
            node.ports.each(function (port: any) {
                if (port.portId !== "") {  // don't change the default port, which is the big shape
                    port.fill = show ? "red" : null;
                }
            });
        }



        var linkSelectionAdornmentTemplate =
            $(go.Adornment, "Link",
                $(go.Shape,
                    // isPanelMain declares that this Shape shares the Link.geometry
                    { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
            );

        myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
                { relinkableFrom: true, relinkableTo: true, reshapable: true },
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5,
                    toShortLength: 4
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape,  // the link path shape
                    { isPanelMain: true, strokeWidth: 2 }),
                $(go.Shape,  // the arrowhead
                    { toArrow: "Standard", stroke: null }),
                $(go.Panel, "Auto",
                    new go.Binding("visible", "isSelected").ofObject(),
                    $(go.Shape, "RoundedRectangle",  // the link shape
                        { fill: "#F8F8F8", stroke: null }),
                    $(go.TextBlock,
                        {
                            textAlign: "center",
                            font: "10pt helvetica, arial, sans-serif",
                            stroke: "#919191",
                            margin: 2,
                            minSize: new go.Size(10, NaN),
                            editable: true
                        },
                        new go.Binding("text").makeTwoWay())
                )
            );


        // myDiagram.groupTemplate =
        //     $(go.Group, "Vertical",
        //         { ungroupable: true }, // allow Ctrl-Shift-G to ungroup a selected Group.
        //         $(go.TextBlock,
        //             { font: "bold 12pt sans-serif" },
        //             new go.Binding("text")),
        //         $(go.Panel, "Auto",
        //             $(go.Shape, { fill: "transparent" }),
        //             $(go.Placeholder, { padding: 10 })
        //         )
        //     );

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
        myDiagram.model.linkKeyProperty = "key1";




        // initialize the third Palette, of wide items
        // let myPaletteWide =
        //     $(go.Palette, "myPaletteWide",
        //         { // share the templates with the main Diagram
        //             nodeTemplate: myDiagram.nodeTemplate,
        //             groupTemplate: myDiagram.groupTemplate
        //         });

        // // specify the contents of the Palette
        // myPaletteWide.model = new go.GraphLinksModel([
        //     { key: "g", color: 'green', size: "100 50" },
        //     { key: "b", color: 'blue', size: "100 50" },
        //     { key: "y", color: 'yellow', size: "100 50" }
        // ]);

        let a = loadFn("a");

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
                $(go.Shape, { strokeWidth: 0, fill: "lightblue" }),
                $(go.TextBlock,
                    { margin: 4, width: 150, font: "normal small-caps 900 15px Sans, Serif", background: "lightblue", textAlign: "start" },
                    new go.Binding("text", "text"))
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
        myPalette.model.nodeKeyProperty = "key1";

        // const myOverview =
        //     $(go.Overview,
        //         {
        //             observed: myDiagram,
        //             contentAlignment: go.Spot.Center
        //         });

        // var inspector = new Inspector( myDiagram,
        //     {
        //         // uncomment this line to only inspect the named properties below instead of all properties on each object:
        //         // includesOwnProperties: false,
        //         properties: {
        //             "text": {},
        //             // key would be automatically added for nodes, but we want to declare it read-only also:
        //             "key": { readOnly: true, show: Inspector.showIfPresent },
        //             // color would be automatically added for nodes, but we want to declare it a color also:
        //             "color": { type: 'color' },
        //             "figure": {}
        //         }
        //     });

        return myPalette;

    }




    render() {
        return (
            <>
                <div className="diagram-area">
                    <ReactDiagram
                        ref={this.diagramRef}
                        divClassName='new-canvas'
                        initDiagram={() => this.initDiagram(this.callDiagramFn)}
                        nodeDataArray={this.props.nodeDataArray}
                        linkDataArray={this.props.linkDataArray}
                        modelData={this.props.modelData}
                        onModelChange={() => this.props.onModelChange(myDiagram.model.toJson())}
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
                            <Menu
                                title={"Networking"}
                                onClick={() => this.handleSelectedMenu("Networking")}
                                active={this.state.selectedMenu === "Networking" ? true : false}
                            />
                            {
                                this.state.selectedMenu === "Networking"
                                    ?
                                    <ReactPalette
                                        initPalette={this.initPalette}
                                        divClassName='palette-component'
                                        nodeDataArray={[  // specify the contents of the Palette
                                            { key: 1, text: "VPC", figure: "RoundedRectangle", "size": "100 auto", fill: "lightgray" },
                                        ]}
                                    />
                                    : null
                            }
                            <Menu
                                title={"Web"}
                                onClick={() => this.handleSelectedMenu("Web")}
                                active={this.state.selectedMenu === "Web" ? true : false}
                            />
                            {
                                this.state.selectedMenu === "Web"
                                    ?
                                    <ReactPalette
                                        initPalette={this.initPalette}
                                        divClassName='palette-component'
                                        nodeDataArray={[  // specify the contents of the Palette
                                            { key: 2, text: "EC2", figure: "RoundedRectangle", "size": "100 auto", fill: "lightgray" },
                                            { key: 3, text: "2PC2", figure: "RoundedRectangle", "size": "100 auto", fill: "lightgray" },
                                            { key: 4, text: "EBS", figure: "RoundedRectangle", "size": "100 auto", fill: "lightgray" },
                                        ]}
                                    />
                                    : null
                            }
                            <Menu
                                title={"Database"}
                                onClick={() => this.handleSelectedMenu("Database")}
                                active={this.state.selectedMenu === "Database" ? true : false}
                            />
                            {
                                this.state.selectedMenu === "Database"
                                    ?
                                    <ReactPalette
                                        initPalette={this.initPalette}
                                        divClassName='palette-component'
                                        nodeDataArray={[  // specify the contents of the Palette
                                            { key: 5, text: "RDS", figure: "RoundedRectangle", "size": "100 auto", fill: "lightgray" },
                                            { key: 6, text: "Mysql", figure: "RoundedRectangle", "size": "100 auto", fill: "lightgray" },
                                            // { key: 7, text: "EBS", figure: "RoundedRectangle", "size": "100 auto", fill: "lightgray" },
                                        ]}
                                    />
                                    : null
                            }

                            {/* <Menu
                                title={"Menu2"}
                                onClick={() => this.handleSelectedMenu("Menu2")}
                            />
                            {
                                this.state.selectedMenu === "Menu2"
                                    ?
                                    <ReactPalette
                                        initPalette={this.initPalette}
                                        divClassName='palette-component'
                                        nodeDataArray={[  // specify the contents of the Palette
                                            { key: 1, text: "VPC1", figure: "RoundedRectangle", "size": "75 auto", fill: "lightgray" },
                                            { key: 2, text: "Subnet1", figure: "RoundedRectangle", "size": "75 auto", fill: "lightgray" },
                                            { key: 3, text: "End1", figure: "RoundedRectangle", "size": "75 auto", fill: "lightgray" },
                                            { key: 4, text: "Group1", figure: "RoundedRectangle", "size": "75 auto", fill: "lightgray", isGroup: true, horiz: false }
                                        ]}

                                    />
                                    : null

                            } */}
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