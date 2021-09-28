import React, { useState, useEffect } from 'react';
import { Container } from "reactstrap";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import Workspace from "../../components/sectionLayout/basicLayout";
import Overlay from "../../components/overlay";
import AddForm from "../../container/workspace/addModal";

import { postAPI, putAPI, deleteAPI, getAPI } from "../../apiCalls/functions/index";
import { ADD_WORKSPACE, UPDATE_WORKSPACE, DELETE_WORKSPACE, SEARCH_WORKSPACE } from "../../apiCalls/urls/executionModule/workspace";
import { GET_ALL_USERS } from "../../apiCalls/urls/executionModule/users";
import { GET_ALL_ORGANIZATION } from "../../apiCalls/urls/executionModule/organisation";
import ModalConfirm from "../../components/actionModal";
import { apiLoading, apiMessage, apiErrorMessage } from '../../store/actions';

//Import Card
const basicColumns = [
    {
        label: 'Id',
        field: 'id',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'Name',
        field: 'name',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'User Name',
        field: 'uname',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'organizationName',
        field: 'organization',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'Action',
        field: 'action',
        sort: 'disabled',
        width: 100
    }

];
const WorkspaceSection = (props: any) => {

    const history = useHistory();

    const [breadcrumbItems, setBreadcrumbs] = useState([
        { title: "Workspace", link: "#" },
        { title: "New", link: "#" },
    ])
    const [overlay, setOverLay] = useState<boolean>(false);
    const [rows, setRows] = useState([])
    const [allData, setAllData] = useState([])
    const [selected, setSelected] = useState(new Set<string>())
    const [selectedItem, setSelectedItem] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)

    //pagination
    const [search, setSearch] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [total, setTotal] = useState(0)

    const [allUsers, setAllUsers] = useState([]);
    const [allOrganizations, setAllOrganizations] = useState([]);

    useEffect(() => {
        fetchAllWorkspace();

        getInitialsData();
        // generateColumns();
    }, [])

    const getInitialsData = async () => {
        let users: any = await getAPI(GET_ALL_USERS)
        let org: any = await getAPI(GET_ALL_ORGANIZATION)
        console.log(users, org)
        if (users && users.status) {
            setAllUsers(users.data)
        }
        if (org && org.status) {
            setAllOrganizations(org.data)
        }

    }

    useEffect(() => {
        fetchAllWorkspace();
    }, [search, pageNo])


    const handleEditSelected = (item: any) => {
        setSelectedItem(item)
        console.log(overlay)
        setOverLay(true)
        console.log(item)
    }

    const handleWorkspace = (id: any) => {
        history.push('/canvas/' + id)
    }

    //
    const updateData = (allData: any) => {
        let _rows = new Array();
        // console.log(allData, "asdsadsa")
        allData && allData.map((a: any) => {
            // console.log(a)
            _rows.push({
                id: a.stackId,
                name: a.terraformBackend.name,
                uname: a.owner?.userFirstName+" "+a.owner?.userLastName,
                organization: a.organization?.organizationName,
                action: <><i
                    onClick={() => handleEditSelected(a)}
                    className="ri-edit-line table-icons"></i>
                    &nbsp;
                    <i
                        onClick={() => handleWorkspace(a.stackId)}
                        className="ri-scan-2-fill table-icons"></i></>
            })
        })

        // console.log(_rows)
        setRows(_rows)
    }

    //API Calls
    const fetchAllWorkspace = async () => {
        let _search = {
            "search": search,
            "sort": {
                "attribute": "stackId",
                "sort": "desc"
            },
            "pageNo": pageNo,
            "itemPerPage": 10
        };

        const allData: any = await postAPI(SEARCH_WORKSPACE, _search);
        console.log(allData.data);
        if (allData.status === "success") {
            setAllData(allData.data.data);
            updateData(allData.data.data);
            setTotal(allData.data.total);
        }

    }

    const addWorkspace = async (data: any) => {
        props.apiLoading();
        console.log(data)

        let _data = {
            ...data
        }
        const allData: any = await postAPI(ADD_WORKSPACE, _data)
        console.log(allData, "sdsadas");
        if (allData.status === "success") {
            setOverLay(false);
            props.apiMessage("Success")

        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllWorkspace();
    }

    const editWorkspace = async (data: any) => {
        props.apiLoading();
        let _data = {
            ...data
        }
        const allData: any = await putAPI(UPDATE_WORKSPACE + selectedItem.stackId, _data)
        console.log(allData);
        if (allData.status === "success") {
            setOverLay(false);
            props.apiMessage("Success")

        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllWorkspace();
    }

    const deleteWorkspace = async () => {
        setDeleteModal(!deleteModal);
        props.apiLoading();

        let myArray = Array.from(selected);
        // console.log(myArray);
        const allData: any = await deleteAPI(DELETE_WORKSPACE + myArray[0])
        if (allData.status === "success") {
            props.apiMessage("Success")
        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllWorkspace();

    }

    const handleAdd = () => {
        setSelectedItem(null);
        setOverLay(!overlay)
    }

    const fetchSelectedPage = (pageNo:any) =>{
        console.log(pageNo)
        setPageNo(pageNo)
    }

    //Functions
    return (
        <>

            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Workspace" breadcrumbItems={breadcrumbItems} />
                </Container>

                <Workspace
                    basicColumns={basicColumns}
                    rows={rows}
                    handleOverlay={() => handleAdd()}
                    delete={() => setDeleteModal(!deleteModal)}
                    allData={allData}
                    actionId="organizationId"
                    setSelected={setSelected}
                    total={total}
                    pageNo={pageNo}
                    setPageNo={setPageNo}
                    fetchSelectedPage={fetchSelectedPage}
                    setSearch={(e: string) => setSearch(e)}
                    section="WORKSPACE"
                />
                {
                    overlay
                        ?
                        <Overlay
                            overlay={overlay}
                            title={(selectedItem ? "Edit" : "Add") + " Workspace"}
                            isLarge={false}
                            handleOverLay={() => setOverLay(false)}
                        >
                            <AddForm
                                addWorkspace={addWorkspace}
                                editWorkspace={editWorkspace}
                                data={selectedItem}

                                allUsers={allUsers}
                                allOrganizations={allOrganizations}
                            />
                        </Overlay>
                        : null
                }
                {
                    deleteModal
                        ?
                        <ModalConfirm
                            modal={deleteModal}
                            toggle={() => setDeleteModal(!deleteModal)}
                            title="Delete Workspace"
                            content="Do you want to delete this Workspace?"
                            click={deleteWorkspace}
                        />
                        : null
                }

            </div>
            x
        </>
    )
}

const mapDispatchToProps = { apiLoading, apiMessage, apiErrorMessage };

export default connect(null, mapDispatchToProps)(WorkspaceSection);

