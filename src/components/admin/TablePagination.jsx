import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

export default function TablePaginationDemo({page,dataSearch, handleChangePage ,rowsPerPage, handleChangeRowsPerPage}) {


  return (
    <TablePagination
      component="div"
      sx={{color:"white"}}
      count={dataSearch.length || 0}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
