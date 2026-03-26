import React, { useState } from "react";
import SearchAdmin from "../../../../components/admin/SearchAdmin";
import TableMovieType from "./TableMovieType";
import ModalMovieType from "./ModalMovieType";
import { addDocument, deleteDocument, updateDocument } from "../../../../services/firebaseService";
import ModalDeleted from "../../../../components/admin/ModalDeleted";
const inner = { name: "", description: "" };

function Movietype(props) {
  const [open, setOpen] = useState(false);
  const [movieType, setMovieType] = useState(inner);
  const [error,setError] = useState(inner);
  const [openDelete,setOpenDelete]=useState(false);
  const [search,setSearch]=useState("");
  const handleClickOpen = () => {
    setOpen(true);
    setMovieType(inner);
  };
  const handleClose = () => {
    setOpen(!open);
  };
  const onchangeInput = (e) => {
    setMovieType({ ...movieType, [e.target.name]: e.target.value });
  };
  const addMovietype = async () => {
    if(validation()){
        return;
    }
    if(movieType.id){
      console.log(movieType);
      
      await updateDocument("movietypes", movieType);
    }
    else{
      await addDocument("movietypes", movieType);
    }
    handleClose();
  };
  const handleEdit = (row)=>{
    handleClickOpen();
    setMovieType(row);
  };
  const handleDeleted= async () => {
    await deleteDocument("movietypes", movieType);
    setOpenDelete(false);
  };
  const handleOpenDeleted=(row)=>{
    setOpenDelete(true);
    setMovieType(row);
  };
  const handleCloseDelete=()=>{
    setOpenDelete(!openDelete);
  };
    const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const validation = () => {
    const newErrors={};
    newErrors.name=movieType.name ? "" : "Please Enter Your Name!";
    newErrors.description=movieType.description ? "" : "Please Enter Your Description!";
    setError(newErrors);
    return Object.values(newErrors).some((e)=>e !=="");
  };
  return (
    <div>
      <SearchAdmin
        handleClickOpen={handleClickOpen}
        title={"List MovieType"}
        add="Add MovieType"
        handleSearch={handleSearch}
      />
      <TableMovieType handleEdit={handleEdit} handleOpenDeleted={handleOpenDeleted} search={search}/>
      <ModalMovieType
        open={open}
        handleClose={handleClose}
        addMovietype={addMovietype}
        onchangeInput={onchangeInput}
        error={error}
        movieType={movieType}
      />
      <ModalDeleted handleCloseDelete={handleCloseDelete} openDelete={openDelete} handleDeleted={handleDeleted}/>
    </div>
  );
}

export default Movietype;
