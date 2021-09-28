import React, { useState, useEffect } from 'react';
import Editor from '../../components/codeEditor';
import FolderStructure from "../../components/folderStructure";
import Overlay from "../../components/overlay";

let data = [
    {
        "id": 12345678,
        "parentId": null,
        "label": "First",
        "items": [
            {
                "id": 87654321,
                "label": "My file",
                "parentId": 12345678,
            }
        ]
    },
    {
        "id": 56789012,
        "parentId": 12345678,
        "label": "My child node",
        "items": [
            {
                "id": 876543211,
                "label": "My file2",
                "parentId": 56789012
            }
        ]
    },
    {
        "id": 12345679,
        "parentId": null,
        "label": "Second",
    }
]

const getFileData = (json) => {

    let allFileComponent = []

    let key = 1;
    let folders = [];
    let topItems = [];
    console.log(json.data);
    json.data && json.data.map((a) => {
        let first = [];
        let firstItem = {};
        let secondItem = {}
        if (!a.isFile) {
            firstItem = {
                "id": key++,
                "parentId": 9999,
                "label": a.name,
            }
            let firstParent = key - 1;
            if (a.data && a.data.length > 0) {
                a.data && a.data.map((b) => {
                    if (!b.isFile) {
                        secondItem = {
                            "id": key++,
                            "parentId": firstParent,
                            "label": b.name,
                        }
                        let secondParent = key - 1;
                        let thirdItem = [];
                        console.log(b.data)
                        if (b.data && b.data.length > 0) {

                            b.data && b.data.map((c) => {
                                if (c.isFile) {
                                    thirdItem.push({
                                        "id": key++,
                                        "parentId": secondParent,
                                        "label": c.name,
                                    })

                                    allFileComponent.push({
                                        name:c.name,
                                        id:key-1,
                                        path:"/"+a.name+"/"+b.name+"/"+c.name

                                    })
                                }
                            })
                        }
                        secondItem = {
                            ...secondItem,
                            items: thirdItem
                        }
                        // console.log(thirdItem);

                    }
                    else {

                    }

                    folders.push(secondItem)
                })
            }
            console.log(firstItem, secondItem)
            folders.push(firstItem)
        }
        else {
            topItems.push({
                "id": key++,
                "parentId": 9999,
                "label": a.name,
            })
            allFileComponent.push({
                name:a.name,
                id:key-1,
                path:"/"+a.name
            })
        }
        
        // if (firstItem && Object.keys(firstItem.length) > 0) {
        //     folders.push(firstItem)
        // }

    })

    folders = [
        {
            "id": 9999,
            "parentId": null,
            "label": "Workspace",
            items:topItems
        },
        ...folders
    ]

    console.log(allFileComponent)


    return {
        folders:folders,
        allFileComponent:allFileComponent,
    };

}

const CodeEditor = (props) => {


    const [allFolders, setOldFolders] = useState([]);
    const [allComponents, setAllComponents] = useState([]);

    useEffect(() =>{
        if(props.folders){
            let folders = getFileData(props.folders);
            setOldFolders(folders.folders);
            setAllComponents(folders.allFileComponent)
        }
    },[props.folders])

    const getSelectedFile = (file) =>{
        console.log(file);
        if(file && file[0]){
            console.log(allComponents)
            let filter = allComponents.filter(a => a.id === file[0]);
            // console.log(filter);
            if(filter && filter.length > 0){
                props.getCodeEditorData(filter[0].path)
            }
        }

    }

    console.log(props)
    return (
        <>
            {
                props.overlay
                    ?
                    <Overlay
                        overlay={props.overlay}
                        isLarge={true}
                        title={"Code Editor"}
                        handleOverLay={() => props.handleOverlay(false)}
                    >
                        <div className="row" style={{ padding: -2 }}>
                            <div className="col-md-2" style={{ padding: 0 }}>
                                <FolderStructure
                                    data={allFolders}
                                    getSelectedFile={getSelectedFile}
                                />
                            </div>
                            <div className="col-md-10" style={{ padding: 0 }}>
                                <Editor
                                    code={props.code}
                                />
                            </div>
                        </div>
                    </Overlay >
                    : null
            }
        </>
    );

}



export default CodeEditor;