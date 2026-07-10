
import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";

import { addDocument, deleteDocument, updateDocument } from "../../../../services/firebaseService";
import ModalPackage from "./ModalPackage";
import TablePackage from "./TablePackage";
const inner = {  discount: "", PlanId: "" , months:"" };
function Package(props) {
  const [open, setOpen] = useState(false);
  const [pkg, setpkg] = useState(inner);
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    setPackage(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setError(inner);
    setpkg(inner);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onchangeInput = (e) => {
    setpkg({ ...pkg, [e.target.name]: e.target.value });
  };

  const validation = () => {
    const newErrors = {};
    newErrors.discount = pkg.discount ? "" : "Please Enter Your discount!";
    newErrors.months = pkg.months
      ? ""
      : "Please Select Your months!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };
  const addpkg = async () => {
    if (validation()) {
      return;
    }
    if (pkg.id) {
      await updateDocument("packages", pkg);
    } else {
      await addDocument("packages", pkg);
    }
    handleClose();
  };

  const handleEdit = (row) => {
    handleClickOpen();
    pkg(row);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  // ham handleDeleted =>  dong modal deleted => deleteDocument category
  const handleDeleted = async () => {
    await deleteDocument("packages", pkg);
    handleCloseDelete();
  };

  return (
    <div>
      <SearchAdmin
        title={"List Package"}
        add="Add Package"
        handleClickOpen={handleClickOpen}
      />
      <TablePackage
        handleEdit={handleEdit}
        handleClickDeleteOpen={handleClickDeleteOpen}
        handleCloseDelete={handleCloseDelete}
        search={search}
      />
      <ModalPackage
        handleClose={handleClose}
        open={open}
        onchangeInput={onchangeInput}
        addpkg={addpkg}
        pkg={pkg}
        error={error}
      />
    </div>
  );
}

export default Package;
