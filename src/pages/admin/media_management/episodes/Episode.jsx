import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../../../services/firebaseService";
import ModalDeleted from "../../../../components/admin/ModalDeleted";
import TableEpisode from "./TableEpisode";
import ModalEpisode from "./ModalEpisode";
const inner = { episodeNumber: "", movieId: "", url: "", sectionId: "" };
function Section(props) {
  const [open, setOpen] = useState(false);
  const [episode, SetEpisode] = useState(inner);
  const [error, setError] = useState(inner);
  const [openDelete, setOpenDelete] = useState(false);
  const [search, setSearch] = useState("");
  const handleClickDeleteOpen = (row) => {
    setOpenDelete(true);
    SetEpisode(row);
  };
  const handleCloseDelete = () => {
    setOpenDelete(!openDelete);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setError(inner);
    SetEpisode(inner);
  };
const onchangInput = (e) => {
    SetEpisode({ ...episode, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onchangeInput = (e) => {
    SetEpisode({ ...episode, [e.target.name]: e.target.value });
  };

  const validation = () => {
    const newErrors = {};
    newErrors.episodeNumber = episode.episodeNumber ? "" : "Please Enter Episode Number!";
    newErrors.movieId = episode.movieId
      ? ""
      : "Please Enter Your Movie ID!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };

  const addEpisode = async () => {
    if (validation()) {
      return;
    }
    if (episode.id) {
      await updateDocument("episodes", episode);
    } else {
      await addDocument("episodes", episode);
    }
    handleClose();
  };

  const handleEdit = (row) => {
    handleClickOpen();
    SetEpisode(row);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  // ham handleDeleted =>  dong modal deleted => deleteDocument category
  const handleDeleted = async () => {
    await deleteDocument("episodes", episode);
    handleCloseDelete();
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        SetEpisode({ ...episode, imgUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <SearchAdmin
        handleClickOpen={handleClickOpen}
        title={"List Episodes"}
        add="Add Episode"
        handleSearch={handleSearch}
      />
      <TableEpisode
        handleEdit={handleEdit}
        handleClickDeleteOpen={handleClickDeleteOpen}
        handleCloseDelete={handleCloseDelete}
        search={search}
      />
      <ModalEpisode
        handleClose={handleClose}
        open={open}
        onchangeInput={onchangeInput}
        addEpisode={addEpisode}
        episode={episode}
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
