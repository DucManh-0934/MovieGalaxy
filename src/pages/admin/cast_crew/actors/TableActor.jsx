import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useMemo, useState } from "react";
import { ContextActor } from "../../../../contexts/ActorProvide";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function TableActor({ search ,handleEdit, handleClickDeleteOpen}) {
  const actors = useContext(ContextActor);
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

    return actors.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, actors]);
  const dataPagination = useMemo(() => {
    return dataSearch.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [page, actors, rowsPerPage, dataSearch]);
  return (
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
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {page * rowsPerPage + index + 1}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">
                <div className="flex justify-end">
                  <img src={row.imgUrl} alt={row.name} className="rounded-full w-10 h-10 object-cover" />
                </div>
              </TableCell>
              <TableCell align="right">
                <div className="flex justify-end text-xl gap-2 items-center">
                  <FaEdit onClick={() => handleEdit(row)} className="text-blue-600" />
                  <MdDelete onClick={() => handleClickDeleteOpen(row)} className="text-red-600" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}