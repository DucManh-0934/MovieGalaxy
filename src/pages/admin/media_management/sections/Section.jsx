import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../../../services/firebaseService";
import ModalDeleted from "../../../../components/admin/ModalDeleted";
import TableSection from "./TableSection";
import ModalSection from "./ModalSection";
const inner = { name: "", movieId: "", imgUrl: "https://tse1.mm.bing.net/th/id/OIP.nvXuvjUByTkaNuF4emVUIQHaEK?pid=Api&h=220&P=0" };
function Section(props) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState(inner);
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    setSection(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setError(inner);
    setSection(inner);
  };
const onchangInput = (e) => {
    setSection({ ...section, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onchangeInput = (e) => {
    setSection({ ...section, [e.target.name]: e.target.value });
  };

  const validation = () => {
    const newErrors = {};
    newErrors.name = section.name ? "" : "Please Enter Your Name!";
    newErrors.movieId = section.movieId
      ? ""
      : "Please Enter Your Movie ID!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };

  const addSection = async () => {
    if (validation()) {
      return;
    }
    if (section.id) {
      await updateDocument("sections", section);
    } else {
      await addDocument("sections", section);
    }
    handleClose();
  };

  const handleEdit = (row) => {
    handleClickOpen();
    setSection(row);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  // ham handleDeleted =>  dong modal deleted => deleteDocument category
  const handleDeleted = async () => {
    await deleteDocument("sections", section);
    handleCloseDelete();
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSection({ ...section, imgUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <SearchAdmin
        handleClickOpen={handleClickOpen}
        title={"List Categories"}
        add="Add Section"
        handleSearch={handleSearch}
      />
      <TableSection
        handleEdit={handleEdit}
        handleClickDeleteOpen={handleClickDeleteOpen}
        handleCloseDelete={handleCloseDelete}
        search={search}
      />
      <ModalSection
        handleClose={handleClose}
        open={open}
        onchangeInput={onchangeInput}
        addSection={addSection}
        section={section}
        error={error}
        handleImageChange={handleImageChange}
        onchangInput={onchangInput}
      />
      <ModalDeleted
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDeleted={handleDeleted}
      />
    </div>
  );
}

export default Section;
