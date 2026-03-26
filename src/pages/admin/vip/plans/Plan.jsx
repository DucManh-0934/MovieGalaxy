import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import TablePlans from "./TablePlans";
import ModalPlans from "./ModalPlans";
import { addDocument, updateDocument } from "../../../../services/firebaseService";
const inner = { title: "" , level: "", price: ""};
function Plan(props) {
  const [open, setOpen] = useState(false);
  const [Plan, setPlan] = useState(inner);
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
    setPlan(inner);
  };
  const handleClose = () => {
    setOpen(!open);
  };
  const onchangeInput = (e) => {
    setPlan({ ...Plan, [e.target.name]: e.target.value });
  };
  const addPlan = async () => {
    if (validation()) {
      return;
    }
    if (Plan.id) {
      console.log(Plan);

      await updateDocument("Plans", Plan);
    } else {
      await addDocument("Plans", Plan);
    }
    handleClose();
  };
  const handleEdit = (row) => {
    handleClickOpen();
    setPlan(row);
  };
  const handleDeleted = async () => {
    await deleteDocument("Plans", Plan);
    setOpenDelete(false);
  };
  const handleOpenDeleted = (row) => {
    setOpenDelete(true);
    setPlan(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const validation = () => {
    const newErrors = {};
    newErrors.title = Plan.title ? "" : "Please Enter Your Title!";
    newErrors.level = Plan.level ? "" : "Please Enter Your Level!";
    newErrors.price = Plan.price ? "" : "Please Enter Your Price!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };
  return (
    <div>
      <SearchAdmin
        title={"VIP Plans"}
        add={"Add VIP Plan"}
        handleSearch={handleSearch}
        handleClickOpen={handleClickOpen}
      />
      <TablePlans handleEdit={handleEdit} handleOpenDeleted={handleOpenDeleted} search={search}/>
      <ModalPlans
        open={open}
        handleClose={handleClose}
        addPlan={addPlan}
        onchangeInput={onchangeInput}
        error={error}
        plan={Plan}
      />
    </div>
  );
}

export default Plan;
