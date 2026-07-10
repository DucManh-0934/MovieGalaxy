import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, TextField } from "@mui/material";
import { LuApple } from "react-icons/lu";
import { TiDelete } from "react-icons/ti";
import { CiUser } from "react-icons/ci";
import { FaFileUpload, FaUser } from "react-icons/fa";
import { ContextAuthor } from "../../../../contexts/AuthorProvide";
import { useContext } from "react";
import ModalChoose from "./ModalChoose";
import { useState } from "react";
import { ContextMovieType } from "../../../../contexts/MovieTypeProvide";
import { ContextCharactor } from "../../../../contexts/CharactorProvide";
import { ContextCategories } from "../../../../contexts/CategoryProvide";
import { objectById } from "../../../../services/reponsitory";
import styled from "@emotion/styled";
import { ContextActor } from "../../../../contexts/ActorProvide";
import { ContextPlan } from "../../../../contexts/PlanProvide";
import { countries } from "../../../../untils/Contants";
import ButtonFile from "../../../../components/ui/ButtonFile";
const years = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
  2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export default function ModalMovie({
  open,
  onchangInput,
  movie,
  addMovie,
  handleClose,
  handleSeclect,
  handleImageChange,
  handleBannerImageChange,
}) {
  const [dataChoose, setDataChoose] = useState([]);
  const authors = useContext(ContextAuthor);
  const movieTypes = useContext(ContextMovieType);
  const charactors = useContext(ContextCharactor);
  const actors = useContext(ContextActor);
  const categories = useContext(ContextCategories);
  const plans = useContext(ContextPlan);
  const [openModal, setOpenModal] = useState(false);
  const [keyChoose, setKeyChoose] = useState("");
  const [search, setSearch] = useState("");
  const selectedPlan = plans.find((p) => p.id === movie.planId);
  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSearch("");
  };
  const handleChoose = (key) => {
    setKeyChoose(key);
    switch (key) {
      case "categories":
        setDataChoose(categories);
        break;
      case "characters":
        setDataChoose(charactors);
        break;
      case "actors":
        setDataChoose(actors);
        break;
      default:
        setDataChoose([]);
        break;
    }
    handleClickOpenModal();
  };
  const getSelectedItems = () => {
    switch (keyChoose) {
      case "categories":
        return movie.listCate;
      case "actors":
        return movie.listActor;
      case "characters":
        return movie.listCharacter;
      default:
        return [];
    }
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">{"Modal Add Movie"}</DialogTitle>
        <DialogContent>
          <div className="grid max-md:grid-cols-1 grid-cols-3 pt-2 gap-3">
            <div className="col-span-1 flex flex-col gap-3">
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                onChange={onchangInput}
                value={movie.name}
              />
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                name="description"
                rows={2}
                onChange={onchangInput}
                value={movie.description}
              />
              <TextField
                id="outlined-basic"
                label="Duration (Minutes)"
                variant="outlined"
                type="number"
                fullWidth
                name="duration"
                rows={2}
                onChange={onchangInput}
                value={movie.duration}
              />
              <div className="grid max-md:grid-cols-1 grid-cols-2 pt-2 gap-2">
                <Autocomplete
                  disablePortal
                  options={years}
                  renderInput={(params) => (
                    <TextField {...params} label="Year" />
                  )}
                />

                <Autocomplete
                  disablePortal
                  options={movieTypes}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="MovieType" />
                  )}
                  onChange={(event, value) => {
                    onchangInput({
                      target: { name: "typeId", value: value.id || "" },
                    });
                  }}
                />
              </div>
              <div className="grid max-md:grid-cols-1 grid-cols-2 pt-2 gap-2">
                <Autocomplete
                  disablePortal
                  options={authors}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Find The AuThor" />
                  )}
                  onChange={(event, value) => {
                    onchangInput({
                      target: { name: "authorId", value: value.id || "" },
                    });
                  }}
                />
                <Autocomplete
                  disablePortal
                  options={countries}
                  renderInput={(params) => (
                    <TextField {...params} label="Find The Country" />
                  )}
                  onChange={(event, value) => {
                    onchangInput({
                      target: { name: "countryId", value: value || "" },
                    });
                  }}
                />
                <Autocomplete
                  disablePortal
                  options={[...plans].sort((a, b) => a.level - b.level)}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField {...params} label="Find The Plan" />
                  )}
                  onChange={(event, value) => {
                    onchangInput({
                      target: { name: "planId", value: value.id || "" },
                    });
                  }}
                />
                {selectedPlan?.level >= 2 && (
                  <TextField
                    id="outlined-basic"
                    label="Giá thuê phim (VNĐ)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    name="priceRent"
                    onChange={onchangInput}
                    value={movie.priceRent}
                  />
                )}
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-3">
              <div className=" flex flex-col gap-1">
                <div className="flex gap-3 items-center ">
                  <h1>Categories</h1>
                  <button
                    className="bg-gray-700 py-2 px-4 rounded-lg text-white"
                    onClick={() => handleChoose("categories")}
                  >
                    <LuApple />
                  </button>
                </div>
                <div className="flex mt-2 gap-2">
                  {movie.listCate.map((cate) => (
                    <button className="bg-gray-400 text-white py-1 px-4 rounded-lg relative">
                      {objectById(categories, cate)?.name}
                      <TiDelete
                        className="absolute text-xl right-0 top-0 translate-x-1/2 transform -translate-y-1/2 text-red-500"
                        onClick={() => handleSeclect(cate, "categories")}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className=" flex flex-col gap-1">
                <div className="flex gap-3 items-center ">
                  <h1>Actors</h1>
                  <button
                    className="bg-gray-700 py-2 px-4 rounded-lg text-white"
                    onClick={() => handleChoose("actors")}
                  >
                    <FaUser />
                  </button>
                </div>
                <div className="flex mt-2">
                  {movie.listActor.map((act) => (
                    <div className="relative">
                      <img
                        src={objectById(actors, act)?.imgUrl}
                        alt=""
                        className="w-13 h-13 rounded-full ml-2"
                      />

                      <TiDelete
                        className="absolute  text-xl right-0 top-0 -translate-x-1/10 transform -translate-y-1/4 text-red-500"
                        onClick={() => handleSeclect(act, "actors")}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className=" flex flex-col gap-1">
                <div className="flex gap-3 items-center ">
                  <h1>Charactors</h1>
                  <button
                    className="bg-gray-700 py-2 px-4 rounded-lg text-white"
                    onClick={() => handleChoose("characters")}
                  >
                    <FaUser />
                  </button>
                </div>
                <div className="flex mt-2">
                  {movie.listCharacter.map((char) => (
                    <div className="relative">
                      <img
                        src={objectById(charactors, char)?.imgUrl}
                        alt=""
                        className="w-13 h-13 rounded-full ml-2"
                      />

                      <TiDelete
                        className="absolute  text-xl right-0 top-0 -translate-x-1/10 transform -translate-y-1/4 text-red-500"
                        onClick={() => handleSeclect(char, "characters")}
                      />
                    </div>
                  ))}
                </div>
                  <ButtonFile
                styleImg={"mt-2 w-full h-30"}
                handleBannerImageChange={handleBannerImageChange}
                object={movie}
                title={"Banner ảnh"}
              />
              </div>
            </div>
            <div className="col-span-1">       
              <ButtonFile
                styleImg={"mt-5 w-full h-full"}
                handleBannerImageChange={handleImageChange}
                object={movie}
                title={"Ảnh"}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Disagree
          </Button>
          <Button variant="contained" autoFocus onClick={addMovie}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <ModalChoose
        dataChoose={dataChoose}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        keyChoose={keyChoose}
        handleSeclect={handleSeclect}
        dataSelect={getSelectedItems()}
        search={search}
        setSearch={setSearch}
      />
    </React.Fragment>
  );
}
