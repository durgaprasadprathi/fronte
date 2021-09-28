import React, { useState, useEffect } from 'react';
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
// import DiagramSection from '../../container/diagram/canvas';
import "./styles.scss";
import DiagramSection from "../../container/gojs";
import { connect } from "react-redux";
import { postAPI, getAPI } from '../../apiCalls/functions/index';
import { generatePalette } from "../../shared/canvas";
import { GET_COMPONENTS, GET_FOLDER, GET_FILE, UPDATE_JSON, VALIDATE_CANVAS, APPLY_CANVAS, PLAN_CANVAS } from "../../apiCalls/urls/executionModule/canvas";
import { GET_ALL_WORKSPACE } from "../../apiCalls/urls/executionModule/workspace";
import { apiLoading, apiLoadingEnd } from '../../store/actions';


import { updateCanvasRightBar, updateCanvasJson, updateCanvasMessage } from "./actions";


const Diagram = (props: any) => {


    const [breadcrumbItems, setBreadcrumbs] = useState([
    ])

    const [allComponents, setAllComponents] = useState([])
    const [allPalettes, setAllPalettes] = useState([])
    const [allProperties, setAllProperties] = useState([])
    const [workspace, setWorkspace] = useState(0);
    const [folders, setFolders] = useState({})
    const [fileData, setFileData] = useState('');
    const [workspaceInitial, setWorkSpaceInitial] = useState(null);
    const [workspaceData, setWorkSpaceData] = useState({});



    useEffect(() => {

        let path = props.location.pathname;
        path = path.split("/");
        console.log(path)
        if (path[2]) {
            setWorkspace(parseInt(path[2]))
            fetchInitialsApis(path[2]);
            getWorkspaceData(path[2])
        }
    }, [])


    const getWorkspaceData = async (workspaceId: any) => {
        let workspaceData: any = await getAPI(GET_ALL_WORKSPACE + workspaceId);
        console.log(workspaceData)
        let properties: any = [];
        if (workspaceData && workspaceData.status === "success") {
            if (workspaceData.data.stackDraftState) {
                setWorkSpaceData(workspaceData.data);
                setWorkSpaceInitial(workspaceData.data.stackDraftState)
                properties = workspaceData.data.stackDraftState.properties
            }
            else {

                setWorkSpaceInitial({
                    canvasState: [],
                    connections: [],
                })
            }

        }
        else {
            setWorkSpaceInitial({
                canvasState: [],
                connections: [],
            })
        }
        console.log(properties)

        props.updateCanvasJson(properties)
    }

    const fetchInitialsApis = async (workspaceId: any) => {
        let components: any = await getAPI(GET_COMPONENTS);
        if (components.status === "success") {
            let palette = generatePalette(components.data);
            console.log(palette);
            setAllPalettes(palette.components)
            setAllProperties(palette.properties)
            setAllComponents(components.data);
        }
        await getFolder(workspaceId);
    }

    const getFolder = async (workspaceId: any) => {
        let data = {
            "workspaceId": workspaceId,
            "path": "/"
        }
        console.log(data);
        let folder: any = await postAPI(GET_FOLDER, data)
        if (folder && folder.status === "success") {
            setFolders(folder.data)
        }
        console.log(folder);
    }

    const getFileData = async (path: any) => {
        let data = {
            "workspaceId": workspace,
            "path": path
        }
        console.log(data);
        let file: any = await postAPI(GET_FILE, data)
        if (file && file.status === "success") {
            setFileData(file.data)
        }
        console.log(file);
    }

    const saveState = async (canvasState: any, connections: any, properties: any) => {
        let data = {
            "workspaceId": workspace,
            "draftState": {
                "canvasState": canvasState ? canvasState : [],
                "connections": connections ? connections : [],
                "properties": properties ? properties : []
            }
        }
        console.log(data);
        let save: any = await postAPI(UPDATE_JSON, data)
        if (save.status === "success") {

        }
        console.log(save);
    }

    const objectToArray = (array: any) => {
        let _obj: any = {};
        array && array.forEach((a: any) => {
            _obj = {
                ..._obj,
                [a.name]: ''
            }
        })

        return _obj;
    }

    const getRightBarContent = (data: any) => {
        console.log(data)
        console.log(props.Diagram)
        let filter = props.Diagram.canvasProperties.filter((c: any) => c.key === data.key);
        // console.log(filter, props.Diagram.canvasProperties)
        if (filter.length > 0) {
            props.updateCanvasRightBar(filter[0])
        }
        else {
            console.log(allProperties)
            let filterProp = allProperties.filter((c: any) => c.name === data.name);
            console.log(filterProp)
            if (filterProp && filterProp[0]) {
                props.updateCanvasRightBar({
                    key: data.key,
                    name: filterProp[0].name,
                    properties: objectToArray(filterProp[0].properties)
                })
            }
        }
    }

    const saveCanvas = async () => {
        props.apiLoading();
        let data = {
            "workspaceId": workspace,
            "isDraft": false,
        }
        console.log(data);
        let save: any = await postAPI(UPDATE_JSON, data)
        if (save && save.status === "success") {
            props.updateCanvasMessage("success", "Canvas successfully saved.", "10-10-2020 11:53AM",  save.data)
        }
        console.log(save);
        props.apiLoadingEnd();

    }

    const validateCanvas = async() => {
        props.apiLoading();
        let data = {
            "workspaceId": workspace,
        }
        console.log(data);
        let save: any = await postAPI(VALIDATE_CANVAS, data)
        if (save && save.status === "success") {
            props.updateCanvasMessage("success", "Terraform validate API executed successfully.", "10-10-2020 11:53AM", save.data)
        }
        console.log(save);
        props.apiLoadingEnd();
       
    }

    const planCanvas = async() => {
        props.apiLoading();
        let data = {
            "workspaceId": workspace,
        }
        console.log(data);
        let save: any = await postAPI(PLAN_CANVAS, data)
        if (save && save.status === "success") {
            props.updateCanvasMessage("success", "Terraform plan API executed successfully.", "10-10-2020 11:53AM",  save.data)
        }
        console.log(save);
        props.apiLoadingEnd();
    }

    const applyCanvas = async() => {
        props.apiLoading();
        let data = {
            "workspaceId": workspace,
        }
        console.log(data);
        let save: any = await postAPI(APPLY_CANVAS, data)
        if (save && save.status === "success") {
            props.updateCanvasMessage("success", "Terraform apply API executed successfully.", "10-10-2020 11:53AM",  save.data)
        }
        console.log(save);
        props.apiLoadingEnd();
    }



    return (
        <>
            {
                workspaceInitial
                    ?
                    <div className="page-content diagram-page">
                        <DiagramSection
                            allPalettes={allPalettes}
                            allProperties={allProperties}

                            getRightBarContent={getRightBarContent}

                            folders={folders}
                            getCodeEditorData={getFileData}
                            code={fileData}

                            saveState={saveState}
                            workspaceInitial={workspaceInitial}
                            workspaceData={workspaceData}

                            saveCanvas={saveCanvas}
                            validateCanvas={validateCanvas}
                            planCanvas={planCanvas}
                            applyCanvas={applyCanvas}
                        />
                    </div>
                    : null

            }

        </>

    )
}

const mapStateToProps = (state: any) => {
    return {
        Diagram: state.Diagram,
    };
};

const mapDispatchToProps = { updateCanvasRightBar, updateCanvasJson, updateCanvasMessage, apiLoading, apiLoadingEnd }

export default connect(mapStateToProps, mapDispatchToProps)(Diagram);
