import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Container } from "reactstrap";
import ModalConfirm from "../../components/actionModal";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import BasicLayout from "../../components/sectionLayout/basicLayout";
import Overlay from "../../components/overlay";
import AddForm from "../../container/roles/addModal";

import { postAPI, putAPI, deleteAPI, getAPI } from "../../apiCalls/functions/index";
import { GET_ALL_ROLES, GET_ONE_ROLE, ADD_ROLE, UPDATE_ROLE, DELETE_ROLE, GET_ALL_PERMISSIONS, EDIT_PERMISSIONS, GET_PERMISSION_OF_ROLE } from "../../apiCalls/urls/executionModule/roles";
import { apiLoading, apiMessage, apiErrorMessage } from '../../store/actions';

//Import Card
const basicColumns = [
    {
        label: 'ID',
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
        label: 'Description',
        field: 'description',
        sort: 'enable',
        width: 150,
    },
    // {
    //     label: 'No of users',
    //     field: 'no',
    //     sort: 'enable',
    //     width: 150,
    // },
    {
        label: 'Action',
        field: 'action',
        sort: 'disabled',
        width: 100
    }

];


const RolesSection = (props: any) => {

    const [breadcrumbItems, setBreadcrumbs] = useState([
        { title: "Roles", link: "#" },
        { title: "New", link: "#" },
    ])
    // const [rows, setRows] = useState([])
    const [overlay, setOverLay] = useState<boolean>(false);
    const [rows, setRows] = useState([])
    const [allData, setAllData] = useState([])
    const [selected, setSelected] = useState(new Set<string>())
    const [selectedItem, setSelectedItem] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [roleId, setRoleId] = useState(null);
    const [permissions, setPermissions] = useState([]);


    //pagination
    const [search, setSearch] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [total, setTotal] = useState(0)


    useEffect(() => {
        fetchAllRoles();
    }, [])

    const updateData = (allData: any) => {
        let _rows = new Array();
        // console.log(allData, "asdsadsa")
        allData && allData.map((a: any) => {
            // console.log(a)
            _rows.push({
                id: a.roleId,
                name: a.roleName,
                description: a.roleDescription,
                action: <i
                    onClick={() => handleEditSelected(a)}
                    className="ri-edit-line table-icons"></i>
            })
        })

        // console.log(_rows)
        setRows(_rows)
    }

    const handleEditSelected = (item: any) => {
        setSelectedItem(item)
        setOverLay(true);
        setRoleId(item.roleId);
        console.log(item);
        fetchPermissionRoles(item.roleId)
    }

    //API Calls
    const fetchPermissionRoles = async (roleId: any) => {
        console.log(roleId);
        const allData: any = await getAPI(GET_PERMISSION_OF_ROLE + roleId + "/permissions");
        console.log(allData, "kua hua");
        if (allData.status === "success") {
            setPermissions(allData.data?.permissions);
        }

    }

    const fetchAllRoles = async () => {
        const allData: any = await getAPI(GET_ALL_ROLES);
        // console.log(allData.data);
        if (allData.status === "success") {
            setAllData(allData.data);
            updateData(allData.data);
            setTotal(allData.data);
        }

    }

    const deleteRoles = async () => {
        setDeleteModal(!deleteModal);
        props.apiLoading();
        
        let myArray = Array.from(selected);
        // console.log(myArray);
        // formData.append('organization_id', myArray[0])
        const allData:any = await deleteAPI(DELETE_ROLE+myArray[0])
        if(allData.status === "success"){
            props.apiMessage("Success")            
        }   
        else{
            props.apiErrorMessage(allData.message)
        }
        fetchAllRoles();
    }

    const addRole = async (data: any) => {
        props.apiLoading();
        const allData: any = await postAPI(ADD_ROLE, data)
        console.log(allData, "sdsadas");
        if (allData.status === "success") {
            setRoleId(allData.data?.roleId);
            props.apiMessage("Success")
        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllRoles();
    }

    const editRole = async (data: any) => {
        props.apiLoading();
        const allData: any = await putAPI(UPDATE_ROLE + roleId, data)
        if (allData.status === "success") {
            props.apiMessage("Success")
        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllRoles();
    }

    const updateRoles = async (data: any) => {
        props.apiLoading();
        let _data = {
            permissions: data
        }
        console.log(_data, roleId);
        const allData: any = await putAPI(EDIT_PERMISSIONS + roleId + "/permissions", _data)
        console.log(allData, "sdsadas");
        if (allData.status === "success") {
            props.apiMessage("Success")
        }
        else {
            props.apiErrorMessage(allData.message)
        }

    }
    //Functions
    return (
        <>

            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Roles" breadcrumbItems={breadcrumbItems} />
                </Container>
                <BasicLayout
                    basicColumns={basicColumns}
                    rows={rows}
                    handleOverlay={() => setOverLay(!overlay)}
                    delete={() => setDeleteModal(!deleteModal)}
                    allData={allData}
                    actionId="organizationId"
                    setSelected={setSelected}
                    total={total}
                    pageNo={pageNo}
                    setPageNo={setPageNo}
                    fetchSelectedPage={1}
                    setSearch={(e: string) => {}}
                    section="ROLES"
                />
                {
                    overlay
                        ?
                        <Overlay
                            overlay={overlay}
                            title={(selectedItem ? "Edit" : "Add") + " Roles"}
                            isLarge={false}
                            handleOverLay={() => setOverLay(false)}
                        >
                            <AddForm
                                roleId={roleId}
                                addRole={addRole}
                                editRole={editRole}
                                data={selectedItem}
                                permissions={permissions}

                                updateRoles={updateRoles}
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
                            title="Delete Organization"
                            content="Do you want to delete this organization?"
                            click={deleteRoles}
                        />
                        : null
                }

            </div>
        </>
    )
}
const mapDispatchToProps = { apiLoading, apiMessage, apiErrorMessage };
export default connect(null, mapDispatchToProps)(RolesSection);

