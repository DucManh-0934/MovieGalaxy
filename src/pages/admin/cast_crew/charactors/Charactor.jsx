import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import ModalCharactor from "./ModalCharactor";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../../../services/firebaseService";
import TableCharactor from "./TableCharactor";
import ModalDeleted from "../../../../components/admin/ModalDeleted";
const inner = {
  name: "",
  description: "",
  imgUrl:
    "https://tse1.mm.bing.net/th/id/OIP.nvXuvjUByTkaNuF4emVUIQHaEK?pid=Api&h=220&P=0",
};
function Character(props) {
  const [open, setOpen] = useState(false);
  const [charactor, setCharactor] = useState(inner);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    setCharactor(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  }
  const addCharactor = async () => {
    if (validation()) {
      return;
    }
    if (charactor.id) {
      await updateDocument("Charactors", charactor);
    } else {
      await addDocument("Charactors", charactor);
    }
    setOpen(false);
  };
  const handleClickOpen = () => {
    setCharactor(inner);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(!open);
  };
  const validation = () => {
    const newErrors = {};
    newErrors.name = charactor.name ? "" : "Please Enter Your Name!";
    newErrors.description = charactor.description
      ? ""
      : "Please Enter Your Description!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCharactor({ ...charactor, imgUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const onchangeInput = (e) => {
    setCharactor({ ...charactor, [e.target.name]: e.target.value });
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleEdit = (row) => {
    setCharactor(row);
    handleClickOpen();
  };
  const handleDeleted = async () => {
    await deleteDocument("Charactors", charactor);
    handleCloseDelete();
  }
  return (
    <div>
      <SearchAdmin
        title={"Character"}
        add="Add Character"
        handleClickOpen={handleClickOpen}
        handleSearch={handleSearch}
      />
      <ModalCharactor
        handleImageChange={handleImageChange}
        open={open}
        handleClose={handleClose}
        addCharactor={addCharactor}
        onchangeInput={onchangeInput}
        charactor={charactor}
        error={error}
      />
      <TableCharactor search={search} handleEdit={handleEdit} handleClickDeleteOpen={handleClickDeleteOpen}/>
      <ModalDeleted openDelete={openDelete} handleCloseDelete={handleCloseDelete} handleDeleted={handleDeleted} />
    </div>
  );
}

export default Character;
