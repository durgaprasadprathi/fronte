import React, { useState, useEffect } from 'react';
import Pagination from "react-js-pagination";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"

const Table = (props: any) => {

    const [allLabels, setAllLabels] = useState<any>([])
    const [sortSelected, setSortSelected] = useState<string>("")
    const [sortType, setSortType] = useState<string>("asc")

    // console.log(props)
    useEffect(() => {
        if (props.rows && props.rows.length > 0) {
            let allLabels = Object.keys(props.rows[0]);
            // console.log(allLabels);
            setAllLabels(allLabels)
        }
    }, [props.rows])


    const handleSelected = (selectedPage: any) => {
        // console.log(selectedPage)
        props.fetchSelectedPage(selectedPage)
    }

    const handleSearch = (e: any) => {
        props.handleSearch(e.target.value)
    }

    const handleSort = (e: string) => {
        setSortSelected(e);
        let _sortType = "asc"
        if (e !== sortSelected) {
            _sortType = "asc"
        }
        else {
            _sortType = sortType === "asc" ? "desc" : "asc";
        }
        setSortType(_sortType);
        // props.updateSort({
        //     "attribute": e,
        //     "sort": _sortType,
        // })
    }


    return (
        <div className="mdb-datatable dt-bootstrap4">
            <div className="row mb-2">
                <div className="col-md-8"></div>
                <div className="col-md-4 table-input text-right" style={{display: "flex", justifyContent: "center", alignItems:'center'}} >
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Search"
                        aria-label="Search"
                        value={props.queryString}
                        onChange={(e) => handleSearch(e)}
                    />
                    &nbsp;
                    {/* <ActionButton
                        onClick={() => { }}
                        title={"Columns"}
                        icon={"ri-layout-column-fill"}
                        color={"blue"}
                        style={{marginBottom:0}}
                    /> */}
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="">
                        <table className="custom-table">
                            <thead className="mdb-dataTable-head">
                                <tr>
                                    {
                                        props.columns && props.columns.map((h: any, i: number) => (
                                            <th>
                                                <div
                                                    onClick={() => handleSort(h.label)}
                                                    className="custom-table-head"
                                                >
                                                    {h.label}
                                                    {
                                                        (sortSelected === h.label && (h.sort !== "disabled"))
                                                            ?
                                                            <i className={sortType === 'desc' ? "ri-arrow-up-line" : "ri-arrow-down-line"}></i>
                                                            : null
                                                    }

                                                </div>

                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    props.rows && props.rows.length > 0 && props.rows.map((r: any, i: number) => (
                                        <tr>
                                            {
                                                allLabels && allLabels.length > 0 && allLabels.map((a: any, j: number) => (
                                                    <td>
                                                        {r[a]}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="col-md-12 table-pagination mt-2">

                    {/* <span>1 - 1 of 1</span> &nbsp;&nbsp;&nbsp; */}
                    <Pagination
                        activePage={props.pageNumber}
                        itemsCountPerPage={10}
                        totalItemsCount={props.totalSize}
                        pageRangeDisplayed={3}
                        onChange={handleSelected}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </div>
            </div>
        </div>
    )
}

export default Table;