import React, { useState, useEffect } from 'react';
import { Container } from "reactstrap";
import { connect } from "react-redux";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import Organization from "../../components/sectionLayout/basicLayout";
import Overlay from "../../components/overlay";
import AddForm from "../../container/keys/addModal";

import { postAPI, putAPI , deleteAPI , getAPI } from "../../apiCalls/functions/index";
import { SEARCH_KEYS, ADD_KEYS, DELETE_KEYS, UPDATE_KEYS } from "../../apiCalls/urls/executionModule/keys";
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
        label: 'Action',
        field: 'action',
        sort: 'disabled',
        width: 100
    }

];
const AwsKeysSection = (props: any) => {

    const [breadcrumbItems, setBreadcrumbs] = useState([
        { title: "AWS keys", link: "#" },
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

    useEffect(() => {
        fetchAllOrganizations();
        // generateColumns();
    }, [])

    useEffect(() => {
        fetchAllOrganizations();
    },[search, pageNo])


    const handleEditSelected = (item: any) => {
        setSelectedItem(item)
        setOverLay(!overlay)
        // console.log(item)
    }

    //
    const updateData = (allData: any) => {
        let _rows = new Array();
        // console.log(allData, "asdsadsa")
        allData && allData.map((a: any) => {
            // console.log(a)
            _rows.push({
                id: a.organizationId,
                name: a.organizationName,
                action: <i
                    onClick={() => handleEditSelected(a)}
                    className="ri-edit-line table-icons"></i>
            })
        })

        // console.log(_rows)
        setRows(_rows)
    }

    //API Calls
    const fetchAllOrganizations = async () => {
        let _search = {
            "search": search,
            "sort": {
                "attribute": "organizationId",
                "sort": "desc"
            },
            "pageNo": pageNo,
            "itemPerPage": 10
        };
        
        const allData: any = await postAPI(SEARCH_KEYS, _search);
        console.log(allData.data);
        if (allData.status === "success") {
            setAllData(allData.data.data);
            updateData(allData.data.data);
            setTotal(allData.data.total);
        }

    }

    const addOrganization = async (data: any) => {
        props.apiLoading();
        let _data = {
            name:data.organizationName
        }
        const allData:any = await postAPI(ADD_KEYS, _data)
        console.log(allData, "sdsadas");
        if(allData.status === "success"){
            setOverLay(false);
            props.apiMessage("Success")
            
        }   
        else{
            props.apiErrorMessage(allData.message)
        }
        fetchAllOrganizations();
    }

    const editOrganization = async (data: any) => {
        props.apiLoading();
        let _data = {
            name:data.organizationName
        }
        const allData:any = await putAPI(UPDATE_KEYS+selectedItem.organizationId, _data)
        console.log(allData);
        if(allData.status === "success"){
            setOverLay(false);
            props.apiMessage("Success")
            
        }   
        else{
            props.apiErrorMessage(allData.message)
        }
        fetchAllOrganizations();
    }

    const deleteOrganization = async () => {
        setDeleteModal(!deleteModal);
        props.apiLoading();
        
        let myArray = Array.from(selected);
        // console.log(myArray);
        // formData.append('organization_id', myArray[0])
        const allData:any = await deleteAPI(DELETE_KEYS+myArray[0])
        if(allData.status === "success"){
            props.apiMessage("Success")            
        }   
        else{
            props.apiErrorMessage(allData.message)
        }
        fetchAllOrganizations();

    }

    const handleAdd = () => {
        setSelectedItem(null);
        setOverLay(!overlay)
    }

    //Functions
    return (
        <>

            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="AWS keys" breadcrumbItems={breadcrumbItems} />
                </Container>
                
                <Organization
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
                    setSearch={(e:string) => setSearch(e)}
                />
                {
                    overlay
                        ?
                        <Overlay
                            overlay={overlay}
                            title={(selectedItem ? "Edit" : "Add") + " AWS key"}
                            isLarge={false}
                            handleOverLay={() => setOverLay(false)}
                        >
                            <AddForm
                                addOrganization={addOrganization}
                                editOrganization={editOrganization}
                                data={selectedItem}
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
                            title="Delete AWS key"
                            content="Do you want to delete this AWS key?"
                            click={deleteOrganization}
                        />
                        : null
                }

            </div>
            x
        </>
    )
}

const mapDispatchToProps={ apiLoading, apiMessage, apiErrorMessage };

export default connect(null, mapDispatchToProps)(AwsKeysSection);

