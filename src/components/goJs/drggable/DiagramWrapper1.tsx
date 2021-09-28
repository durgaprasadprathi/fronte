/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import * as React from 'react';

import { GuidedDraggingTool } from '../GuidedDraggingTool';

import './Diagram.css';

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<DiagramProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;
  private myDiagram: any;

  /** @internal */
  constructor(props: DiagramProps) {
    super(props);
    this.diagramRef = React.createRef();
    this.myDiagram = go.Diagram;
    this.randomGroup = this.randomGroup.bind(this);
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */

  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";


    this.myDiagram =
      $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
        {
          grid: $(go.Panel, "Grid",
            $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
            $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
            $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
            $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
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
          "undoManager.isEnabled": true
        });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    this.myDiagram.addDiagramListener("Modified", function (e: any) {
      // var button = document.getElementById("SaveButton");
      // if (button) button.disabled = !myDiagram.isModified;
      // var idx = document.title.indexOf("*");
      // if (myDiagram.isModified) {
      //   if (idx < 0) document.title += "*";
      // } else {
      //   if (idx >= 0) document.title = document.title.substr(0, idx);
      // }
    });

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
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
          fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
          cursor: "pointer"  // show a different cursor to indicate potential link point
        });
    }

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

    this.myDiagram.nodeTemplate =
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Center },
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
              margin: 8,
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

    function showSmallPorts(node: any, show: any) {
      node.ports.each(function (port: any) {
        if (port.portId !== "") {  // don't change the default port, which is the big shape
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
    }

    var linkSelectionAdornmentTemplate =
      $(go.Adornment, "Link",
        $(go.Shape,
          // isPanelMain declares that this Shape shares the Link.geometry
          { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
      );

    this.myDiagram.linkTemplate =
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

    this.myDiagram.groupTemplate =
      $(go.Group, "Auto",
        { // define the group's internal layout
          layout: $(go.TreeLayout,
            { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
          // the group begins unexpanded;
          // upon expansion, a Diagram Listener will generate contents for the group
          isSubGraphExpanded: false,
          // when a group is expanded, if it contains no parts, generate a subGraph inside of it
          subGraphExpandedChanged: function (group: any) {
            if (group.memberParts.count === 0) {
              // this.randomGroup(, myDiagram);

              // let newGroup = group.data.key;
              // myDiagram.startTransaction("addGroupContents");
              // var addedKeys = [];  // this will contain the keys of all nodes created
              // var groupCount = 0;  // the number of groups in the diagram, to determine the numbers in the keys of new groups
              // this.myDiagram.nodes.each(function (node: any) {
              //   if (node instanceof go.Group) groupCount++;
              // });
              // // create a random number of groups
              // // ensure there are at least 10 groups in the diagram
              // var groups = Math.floor(Math.random() * 2);
              // if (groupCount < 10) groups += 1;
              // for (var i = 0; i < groups; i++) {
              //   var name = "group" + (i + groupCount);
              //   this.myDiagram.model.addNodeData({ key: name, isGroup: true, group: newGroup });
              //   addedKeys.push(name);
              // }
              // var nodes = Math.floor(Math.random() * 3) + 2;
              // // create a random number of non-group nodes
              // for (var i = 0; i < nodes; i++) {
              //   var color = go.Brush.randomColor();
              //   // make sure the color, which will be the node's key, is unique in the diagram before adding the new node
              //   if (this.myDiagram.findPartForKey(color) === null) {
              //     this.myDiagram.model.addNodeData({ key: color, group: newGroup });
              //     addedKeys.push(color);
              //   }
              // }
              // // add at least one link from each node to another
              // // this could result in clusters of nodes unreachable from each other, but no lone nodes
              // var arr = [];
              // for (var x in addedKeys) arr.push(addedKeys[x]);
              // arr.sort(function (x, y) { return Math.random() - 1; });
              // for (var i = 0; i < arr.length; i++) {
              //   var from = Math.floor(Math.random() * (arr.length - i)) + i;
              //   if (from !== i) {
              //     this.myDiagram.model.addLinkData({ from: arr[from], to: arr[i] });
              //   }
              // }
              // this.myDiagram.commitTransaction("addGroupContents");
            }
          }
        },
        $(go.Shape, "Rectangle",
          { fill: null, stroke: "gray", strokeWidth: 2 }),
        $(go.Panel, "Vertical",
          { defaultAlignment: go.Spot.Left, margin: 4 },
          $(go.Panel, "Horizontal",
            { defaultAlignment: go.Spot.Top },
            // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
            $("SubGraphExpanderButton"),
            $(go.TextBlock,
              { font: "Bold 18px Sans-Serif", margin: 4 },
              new go.Binding("text", "key"))
          ),
          // create a placeholder to represent the area where the contents of the group are
          $(go.Placeholder,
            { padding: new go.Margin(0, 10) })
        )  // end Vertical Panel
      );  // end Group



    

    // initialize the Palette that is on the left side of the page


    return this.myDiagram;
  }

  private initPalette(): any {
    const $ = go.GraphObject.make;
    const myPalette =
    $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
      {
        maxSelectionCount: 1,
        nodeTemplateMap: this.myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
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
        model: new go.GraphLinksModel([  // specify the contents of the Palette
          { text: "Start", figure: "Ellipse", "size": "75 75", fill: "#00AD5F" },
          { text: "Step" },
          { text: "DB", figure: "Ellipse", fill: "lightgray" },
          { text: "???", figure: "Diamond", fill: "lightskyblue" },
          { text: "End", figure: "Ellipse", "size": "75 75", fill: "#CE0620" },
          { text: "Comment", figure: "RoundedRectangle", fill: "lightyellow" },
        ], [
          // the Palette also has a disconnected Link, which the user can drag-and-drop
          { points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
        ])
      });

      return myPalette
  }

  public randomGroup(group: any, myDiagram: any) {
    // all modification to the diagram is within this transaction
    myDiagram.startTransaction("addGroupContents");
    var addedKeys = [];  // this will contain the keys of all nodes created
    var groupCount = 0;  // the number of groups in the diagram, to determine the numbers in the keys of new groups
    myDiagram.nodes.each(function (node: any) {
      if (node instanceof go.Group) groupCount++;
    });
    // create a random number of groups
    // ensure there are at least 10 groups in the diagram
    var groups = Math.floor(Math.random() * 2);
    if (groupCount < 10) groups += 1;
    for (var i = 0; i < groups; i++) {
      var name = "group" + (i + groupCount);
      myDiagram.model.addNodeData({ key: name, isGroup: true, group: group });
      addedKeys.push(name);
    }
    var nodes = Math.floor(Math.random() * 3) + 2;
    // create a random number of non-group nodes
    for (var i = 0; i < nodes; i++) {
      var color = go.Brush.randomColor();
      // make sure the color, which will be the node's key, is unique in the diagram before adding the new node
      if (myDiagram.findPartForKey(color) === null) {
        myDiagram.model.addNodeData({ key: color, group: group });
        addedKeys.push(color);
      }
    }
    // add at least one link from each node to another
    // this could result in clusters of nodes unreachable from each other, but no lone nodes
    var arr = [];
    for (var x in addedKeys) arr.push(addedKeys[x]);
    // arr.sort(function (x, y) { return Math.random(2) - 1; });
    for (var i = 0; i < arr.length; i++) {
      var from = Math.floor(Math.random() * (arr.length - i)) + i;
      if (from !== i) {
        myDiagram.model.addLinkData({ from: arr[from], to: arr[i] });
      }
    }
    myDiagram.commitTransaction("addGroupContents");
  }


  public render() {
    return (
      <>
        <ReactDiagram
          ref={this.diagramRef}
          divClassName='diagram-component'
          initDiagram={this.initDiagram}
          nodeDataArray={this.props.nodeDataArray}
          linkDataArray={this.props.linkDataArray}
          modelData={this.props.modelData}
          onModelChange={this.props.onModelChange}
          skipsDiagramUpdate={this.props.skipsDiagramUpdate}
        />
        <ReactPalette
          initPalette={this.initPalette}
          divClassName='palette-component'
          nodeDataArray={[{ key: 0, text: 'Alpha' }]}
        />
      </>
    );
  }
}
