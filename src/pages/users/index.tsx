import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Form, FormGroup, Label, Card, CardBody, CardTitle, Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import UserLayout from "../../components/sectionLayout/basicLayout";
import Overlay from "../../components/overlay";
import AddForm from "../../container/users/addModal";

import { postAPI, putAPI, deleteAPI, getAPI } from "../../apiCalls/functions/index";
import { SEARCH_USERS, ADD_USERS, UPDATE_USERS, DELETE_USERS } from "../../apiCalls/urls/executionModule/users";
import { GET_ALL_ORGANIZATION} from "../../apiCalls/urls/executionModule/organisation";


import ModalConfirm from "../../components/actionModal";
import { apiLoading, apiMessage, apiErrorMessage } from '../../store/actions';


//Import Card
const basicColumns = [
    {
        label: 'User Id',
        field: 'id',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'First name',
        field: 'f_name',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'Last name',
        field: 'l_name',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'Organization',
        field: 'org',
        sort: 'enable',
        width: 150,
    },
    {
        label: 'Username',
        field: 'email',
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




const UserSection = (props: any) => {

    const [breadcrumbItems, setBreadcrumbs] = useState([
        { title: "Users", link: "#" },
        { title: "New", link: "#" },
    ])
    const [overlay, setOverLay] = useState<boolean>(false);
    const [rows, setRows] = useState([])
    const [allData, setAllData] = useState([])
    const [selected, setSelected] = useState(new Set<string>())
    const [selectedItem, setSelectedItem] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false);

    const [allOrganizations, setAllOrganizations] = useState([]);

    //pagination
    const [search, setSearch] = useState('');
    const [pageNo, setPageNo] = useState(1);
    const [total, setTotal] = useState(0)


    useEffect(() => {
        fetchAllUsers();

        getInitialsData();


    }, [])

    const getInitialsData = async() =>{
     
        let org:any = await getAPI(GET_ALL_ORGANIZATION)

        if( org && org.status){
            setAllOrganizations(org.data)
        }

    }

    useEffect(() => {
        fetchAllUsers();
    },[search, pageNo])

    const handleEditSelected = (item: any) => {
        setSelectedItem(item)
        setOverLay(!overlay)
    }

    //
    const updateData = (allData: any) => {
        let _rows = new Array();
        // console.log(allData, "asdsadsa")
        allData && allData.map((a: any) => {
            // console.log(a)
            _rows.push({
                id:a.userId,
                f_name: a.userFirstName,
                l_name: a.userLastName,
                organization: a.userOrganization?.organizationName,
                email: a.userName,
                action: <i
                    onClick={() => handleEditSelected(a)}
                    className="ri-edit-line table-icons"></i>
            })
        })

        // console.log(_rows)
        setRows(_rows)
    }

    //API Calls
    const fetchAllUsers = async () => {
        let _search = {
            "search": search,
            "sort": {
                "attribute": "userId",
                "sort": "desc"
            },
            "pageNo": pageNo,
            "itemPerPage": 10
        };
        const allData: any = await postAPI(SEARCH_USERS, _search)
        console.log(allData);
        if (allData.status) {
            setAllData(allData.data.data);
            updateData(allData.data.data);
            setTotal(allData.data.total);
        }

    }

    const addUsers = async (data: any) => {
        props.apiLoading();

        let _data = {
            ...data
        }
        console.log(_data);
        const allData: any = await postAPI(ADD_USERS, _data)
        console.log(allData, "sdsadas");
        if (allData.status === "success") {
            setOverLay(false);
            props.apiMessage("Success")

        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllUsers();
    }

    const editUsers = async (data: any) => {
        console.log("sadsad");
        props.apiLoading();
        let _data = {
            ...data
        }
        const allData: any = await putAPI(UPDATE_USERS + selectedItem.userId, _data)
        console.log(allData);
        if (allData.status === "success") {
            setOverLay(false);
            props.apiMessage("Success")

        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllUsers();
    }

    const deleteUsers = async () => {
        setDeleteModal(!deleteModal);
        props.apiLoading();

        let myArray = Array.from(selected);
        // console.log(myArray);
        // formData.append('organization_id', myArray[0])
        const allData: any = await deleteAPI(DELETE_USERS + myArray[0])
        if (allData.status === "success") {
            props.apiMessage("Success")
        }
        else {
            props.apiErrorMessage(allData.message)
        }
        fetchAllUsers();

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
                    <Breadcrumbs title="Users" breadcrumbItems={breadcrumbItems} />
                </Container>
                <UserLayout
                    basicColumns={basicColumns}
                    rows={rows}
                    handleOverlay={() => handleAdd()}
                    delete={() => setDeleteModal(!deleteModal)}
                    allData={allData}
                    actionId="userId"
                    setSelected={setSelected}
                    total={total}
                    pageNo={pageNo}
                    fetchSelectedPage={fetchSelectedPage}
                    setSearch={(e:string) => setSearch(e)}
                    section="USER"
                />
                {
                    overlay
                        ?
                        <Overlay
                            overlay={overlay}
                            title={(selectedItem ? "Edit" : "Add") + " Users"}
                            isLarge={false}
                            handleOverLay={() => setOverLay(false)}
                        >
                            <AddForm
                                addUsers={addUsers}
                                editUsers={editUsers}
                                data={selectedItem}

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
                            title="Delete Users"
                            content="Do you want to delete this users?"
                            click={deleteUsers}
                        />
                        : null
                }

            </div>
        </>
    )
}


const mapDispatchToProps = { apiLoading, apiMessage, apiErrorMessage };

export default connect(null, mapDispatchToProps)(UserSection);
