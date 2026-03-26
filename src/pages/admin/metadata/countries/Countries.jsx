import React from 'react';
import SearchAdmin from '../../../../components/admin/SearchAdmin';
import TableContries from './TableContries';
import ModalContries from './ModalContries';

function Countries(props) {
    return (
        <div>
            <SearchAdmin title={"Countries"}
            add={"Add Country"} />
            <TableContries />
            <ModalContries />
        </div>
    );
}

export default Countries;