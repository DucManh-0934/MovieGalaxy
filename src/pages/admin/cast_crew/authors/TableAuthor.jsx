import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useContext, useMemo, useState } from "react";
import { ContextAuthor } from "../../../../contexts/AuthorProvide";
import TablePaginationDemo from "../../../../components/admin/TablePagination";
import { convertDescription } from "../../../../services/reponsitory";
export default function TableAuthor({search,handleClickDeleteOpen,handleEdit}) {
  const authors = useContext(ContextAuthor);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const dataSearch = useMemo(() => {
    console.log(search);
    
    return authors.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, authors]);
  const dataPagination = useMemo(() => {
    return dataSearch.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [page, authors, rowsPerPage, dataSearch]);
  return (
    <div className="">
      <TableContainer
        component={Paper}
        sx={{
          mt: 2,
          borderRadius: 3,
          background: "rgba(0,0,0,0.25)",
          boxShadow: "0 8px 24px rgba(0,255,255,0.1)",
          border: "1px solid rgba(0,255,255,0.15)",
          overflow: "visible !important",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              color: "white",
            },
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Img</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPagination.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{convertDescription(row.description)}</TableCell>
                <TableCell align="right">
                  <img src={row.imgUrl} alt={row.name} className="h-10 w-10 rounded-full" />
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end text-xl gap-2 items-center">
                    <FaEdit className="text-blue-600" onClick={() => handleEdit(row)} />
                    <MdDelete className="text-red-600" onClick={() => handleClickDeleteOpen(row)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationDemo
        rowsPerPage={rowsPerPage}
        page={page}
        dataSearch={dataSearch}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
