import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import ModalAuthor from "./ModalAuthor";
import TableAuthor from "./TableAuthor";
import { addDocument, deleteDocument } from "../../../../services/firebaseService";
import ModalDeleted from "../../../../components/admin/ModalDeleted";
const inner = {
  name: "",
  description: "",
  imgUrl:
    "https://tse1.mm.bing.net/th/id/OIP.nvXuvjUByTkaNuF4emVUIQHaEK?pid=Api&h=220&P=0",
};
function Author(props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState(inner);
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const onchangeInput = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };
  const handleClickOpen = () => {
    setAuthor(inner);
    setError(inner);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(!open);
  };
  const validation = () => {
    const newErrors = {};
    newErrors.name = author.name ? "" : "Please Enter Your Name!";
    newErrors.description = author.description
      ? ""
      : "Please Enter Your Description!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };
  const addAuthor = async () => {
    if (validation()) {
      return;
    }
    await addDocument("authors", author);
    setOpen(false);
  };
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    setAuthor(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAuthor({ ...author, imgUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEdit = (row) => {
    setAuthor(row);
    handleClickOpen();
  };
  const handleDeleted = async () => {
    await deleteDocument("authors", author);
    handleCloseDelete();
  };
  return (
    <div>
      <SearchAdmin
        title={"Author"}
        add={"Add Author"}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        handleSearch={handleSearch}
      />
      <ModalAuthor
        open={open}
        handleClose={handleClose}
        author={author}
        setAuthor={setAuthor}
        onchangeInput={onchangeInput}
        error={error}
        handleImageChange={handleImageChange}
        addAuthor={addAuthor}
      />
      <TableAuthor search={search} handleEdit={handleEdit} handleClickDeleteOpen={handleClickDeleteOpen} />
      <ModalDeleted handleDeleted={handleDeleted} openDelete={openDelete} handleCloseDelete={handleCloseDelete} />
    </div>
  );
}

export default Author;
