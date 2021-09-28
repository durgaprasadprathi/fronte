import { useState, useEffect } from 'react';
import Layout from "../../../components/pageLayout"
import TableWithCheckbox from "../../../components/tableWithCheckbox";
import ActionButton from '../../../components/UI/actionButton';
const BasicLayout = (props: any) => {

    let [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([])
    const [selected, setSelected] = useState(new Set<string>());
    const [roles, setRoles] = useState([]);

    useEffect(() =>{
        let roles:any = localStorage.getItem("authUser");
        if(roles) {
            roles = JSON.parse(roles);
            console.log(roles);
            setRoles(roles?.data?.permissions);
        }
    },[])

    useEffect(() => {
        updateData();
        generateColumns();
    },[props.rows])

    useEffect(() => {
        generateColumns();
        updateData();
    }, [selected])

    const generateColumns = () => {
        let _select = {
            label: <input
                type="checkbox"
                checked={checkSelectAll()}
                onChange={(e) => updateSelectAll(e)}
            />,
            field: 'select',
            sort: 'disabled',
            width: 150,
        }
        setColumns([_select, ...props.basicColumns])
    }

    const checkSelectAll = () => {
        // console.log(props.allData.length, selected.size)
       
        if ( props.allData && props.allData.length === selected.size && props.allData.length > 0) {
            return true;
        }
        else {
            return false;
        }

    }

    const updateSelectAll = (e: any) => {
        // console.log(e.target.checked, "asdsad", props.actionId)
        if (e.target.checked) {
            let _selected = new Set<string>();
            props.allData.map((a: any) => {
                _selected.add(a[props.actionId])
            })
            // console.log(_selected, props.allData)
            setSelected(_selected)
            props.setSelected(_selected)
        }
        else {
            setSelected(new Set<string>());
            props.setSelected(new Set<string>())
        }
    }

    const updateSelectedSelected = (e: any, id: any) => {
        var _selected = new Set(selected)
        if (e.target.checked) {
            _selected.add(id)
        }
        else {
            _selected.delete(id)
        }
        setSelected(_selected)
        props.setSelected(_selected)

    }

    const updateData = () => {
        let _rows = new Array();
        // console.log("asdsadsa")
        props.rows &&  props.rows.map((a: any) => {
            // console.log(a)
            _rows.push({
                select: <input
                    type="checkbox"
                    checked={selected.has(a.id) ? true : false}
                    onChange={(e) => updateSelectedSelected(e, a.id)}

                />,
                ...a
            })
        })

        // console.log(_rows)
        setRows(_rows)
    }

    return (
        <>
            <ActionButton
                onClick={props.handleOverlay}
                title={"Add"}
                icon={"ri-add-circle-fill"}
            />
            <ActionButton
                onClick={props.delete}
                title={"Delete"}
                icon={"ri-delete-bin-line"}
                color={"red"}
            />
            <ActionButton
                onClick={() => { }}
                title={"Import"}
                icon={"ri-upload-2-line"}
            />
            <ActionButton
                onClick={() => { }}
                title={"Export"}
                icon={"ri-download-2-line"}
            />
            <Layout
                title=""
            >
                <TableWithCheckbox
                    columns={columns}
                    pageNumber={props.pageNo}
                    totalSize={props.total}
                    rows={rows}
                    handleSearch={props.setSearch}
                    fetchSelectedPage={props.fetchSelectedPage}
                    updateSort={props.updateSort}
                />
            </Layout>
        </>
    )
}

export default BasicLayout;