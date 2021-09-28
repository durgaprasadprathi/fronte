import React from 'react';
import Table from "../UI/Table";

const TableWithCheckBox = (props: any) => {
    return (
        <>
            <Table
                columns={props.columns}
                pageNumber={props.pageNumber}
                totalSize={props.totalSize}
                rows={props.rows}
                handleSearch={props.handleSearch}
                fetchSelectedPage={props.fetchSelectedPage}
                updateSort={props.updateSort}
            />
        </>
    )
}

export default TableWithCheckBox;