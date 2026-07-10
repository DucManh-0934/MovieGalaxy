import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import TableFeature from "./TableFeature";
import ModalFeature from "./ModalFeature";
import { addDocument, deleteDocument, updateDocument } from "../../../../services/firebaseService";
const inner = { name: "", description: "", PlanId: "" };
function Feature(props) {
  const [open, setOpen] = useState(false);
  const [feature, setfeature] = useState(inner);
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    setfeature(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setError(inner);
    setfeature(inner);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onchangeInput = (e) => {
    setfeature({ ...feature, [e.target.name]: e.target.value });
  };

  const validation = () => {
    const newErrors = {};
    newErrors.name = feature.name ? "" : "Please Enter Your Name!";
    newErrors.description = feature.description
      ? ""
      : "Please Select Yes or No!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };
  const addfeature = async () => {
    if (validation()) {
      return;
    }
    if (feature.id) {
      await updateDocument("featuries", feature);
    } else {
      await addDocument("featuries", feature);
    }
    handleClose();
  };

  const handleEdit = (row) => {
    handleClickOpen();
    setfeature(row);
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
        title={"List Features"}
        add="Add Features"
        handleClickOpen={handleClickOpen}
      />
      <TableFeature
        handleEdit={handleEdit}
        handleClickDeleteOpen={handleClickDeleteOpen}
        handleCloseDelete={handleCloseDelete}
        search={search}
      />
      <ModalFeature
        handleClose={handleClose}
        open={open}
        onchangeInput={onchangeInput}
        addfeature={addfeature}
        feature={feature}
        error={error}
      />
    </div>
  );
}

export default Feature;
