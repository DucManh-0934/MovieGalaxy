import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useContext, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import TablePaginationDemo from "../../../../components/admin/TablePagination";
import { ContextSection } from "../../../../contexts/SectionPrivide";
import { ContextMovie } from "../../../../contexts/MoviePrivide";
import { ContextEpisode } from "../../../../contexts/EpisodeProvide";

export default function TableEpisode({
  handleEdit,
  handleClickDeleteOpen,
  search,
}) {
  const episodes = useContext(ContextEpisode);
  const movies = useContext(ContextMovie);
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
    return episodes.filter((e) =>
      e.episodeNumber.toString().includes(search.toLowerCase()),
    );
  }, [search, episodes]);

  const dataPagination = useMemo(() => {
    return dataSearch.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [page, episodes, rowsPerPage, dataSearch]);

  return (
    <div className="mt-5">
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
              <TableCell align="right">Chap</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Url</TableCell>
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
                <TableCell align="right">{row.episodeNumber}</TableCell>
                <TableCell align="right">{movies.find((movie) => movie.id === row.movieId)?.name || "Movie not found"}</TableCell>
                <TableCell align="right">
                  {row.url}
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end text-xl gap-2 items-center">
                    <FaEdit
                      className="text-blue-600"
                      onClick={() => handleEdit(row)}
                    />
                    <MdDelete
                      onClick={() => handleClickDeleteOpen(row)}
                      className="text-red-600"
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
