import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import TableCategory from "./TableCategory";
import ModalCategory from "./ModalCategory";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../../../services/firebaseService";
import ModalDeleted from "../../../../components/admin/ModalDeleted";
const inner = { name: "", description: "" };
function Categories(props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(inner);
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    setCategory(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setError(inner);
    setCategory(inner);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onchangeInput = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const validation = () => {
    const newErrors = {};
    newErrors.name = category.name ? "" : "Please Enter Your Name!";
    newErrors.description = category.description
      ? ""
      : "Please Enter Your Descrip!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };

  const addCategory = async () => {
    if (validation()) {
      return;
    }
    if (category.id) {
      await updateDocument("categories", category);
    } else {
      await addDocument("categories", category);
    }
    handleClose();
  };

  const handleEdit = (row) => {
    handleClickOpen();
    setCategory(row);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  // ham handleDeleted =>  dong modal deleted => deleteDocument category
  const handleDeleted = async () => {
    await deleteDocument("categories", category);
    handleCloseDelete();
  };

  return (
    <div>
      <SearchAdmin
        handleClickOpen={handleClickOpen}
        title={"List Categories"}
        add="Add Category"
        handleSearch={handleSearch}
      />
      <TableCategory
        handleEdit={handleEdit}
        handleClickDeleteOpen={handleClickDeleteOpen}
        handleCloseDelete={handleCloseDelete}
        search={search}
      />
      <ModalCategory
        handleClose={handleClose}
        open={open}
        onchangeInput={onchangeInput}
        addCategory={addCategory}
        category={category}
        error={error}
      />
      <ModalDeleted
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDeleted={handleDeleted}
      />
    </div>
  );
}

export default Categories;
