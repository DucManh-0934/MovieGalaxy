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
import { ContextMovieType } from "../../../../contexts/MovieTypeProvide";
import TablePaginationDemo from "../../../../components/admin/TablePagination";
import { ContextPlan } from "../../../../contexts/PlanProvide";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function TablePlans({
  handleEdit,
  handleOpenDeleted,
  search,
}) {
  const plans = useContext(ContextPlan);
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
    return plans.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, plans]);

  const dataPagination =useMemo(()=>{
    return dataSearch.slice(page*rowsPerPage,page * rowsPerPage + rowsPerPage);
  },[page, plans,rowsPerPage , dataSearch]);
  
  return (
    <div>
      <TableContainer component={Paper} className="mt-3"
      sx={{
          mt: 2,
          borderRadius: 3,
          background: "rgba(0,0,0,0.25)",
          boxShadow: "0 8px 24px rgba(0,255,255,0.1)",
          border: "1px solid rgba(0,255,255,0.15)",
          overflow: "visible !important",
        }}>
        <Table sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              color: "white",
            },
          }}
          aria-label="simple table">
          <TableHead>
            <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="right">Title</TableCell>
              <TableCell align="right">Level</TableCell>
              <TableCell align="right">Price</TableCell>
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
                  {page * rowsPerPage + index +1}
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.level}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">
                  <div className="flex justify-end text-xl gap-2 items-center">
                    <FaEdit
                      className="text-blue-600"
                      onClick={() => handleEdit(row)}
                    />
                    <MdDelete
                      className="text-red-600"
                      onClick={() => handleOpenDeleted(row)}
                    />
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