import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import TableActor from "./TableActor";
import ModalActor from "./ModalActor";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../../../services/firebaseService";
import ModalDeleted from "../../../../components/admin/ModalDeleted";
const inner = {
  name: "",
  description: "",
  imgUrl:
    "https://tse1.mm.bing.net/th/id/OIP.nvXuvjUByTkaNuF4emVUIQHaEK?pid=Api&h=220&P=0",
};
function Actor(props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = React.useState(false);
  const [actor, setActor] = React.useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    setActor(row);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onchangeInput = (e) => {
    console.log("vvs");

    setActor({ ...actor, [e.target.name]: e.target.value });
  };
  const handleEdit = (row) => {
    setActor(row);
    handleClickOpen();
  };
  const handleDeleted = async () => {
    await deleteDocument("actors", actor);
    handleCloseDelete();
  };
  const addActor = async () => {
    if (actor.id) {
      await updateDocument("actors", actor);
    } else {
      await addDocument("actors", actor);
      setOpen(false);
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setActor({ ...actor, imgUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <SearchAdmin
        title={"Actor"}
        add={"Add Actor"}
        handleClickOpen={handleClickOpen}
        handleSearch={handleSearch}
      />
      <TableActor
        search={search}
        handleEdit={handleEdit}
        handleClickDeleteOpen={handleClickDeleteOpen}
      />
      <ModalActor
        open={open}
        actor={actor}
        handleClose={handleClose}
        onchangeInput={onchangeInput}
        addActor={addActor}
        handleImageChange={handleImageChange}
      />
      <ModalDeleted
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDeleted={handleDeleted}
      />
    </div>
  );
}

export default Actor;
