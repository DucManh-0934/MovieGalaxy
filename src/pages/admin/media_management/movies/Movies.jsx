import SearchAdmin from "../../../../components/admin/SearchAdmin";
import ModalMovie from "./ModalMovie";
import ModalChoose from "./ModalChoose";
import { useState } from "react";
import { addDocument } from "../../../../services/firebaseService";
import ModalTable from "./ModalTable";
const inner = {
  name: "",
  description: "",
  duration: "",
  countryId: "",
  authorId: "",
  planId: "",
  typeId: "",
  creatAt: new Date(),
  listCate: [],
  listActor: [],
  listCharacter: [],
  view: 0,
  priceRent: 0,
  imgUrl: "",
};

function Movies(props) {
  const [open, setOpen] = useState(false);
  const [movie, setMovie] = useState(inner);
  const toggleSelection = (list, item) => {
    return list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMovie({ ...movie, imgUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSeclect = (item, type) => {
    setMovie((prev) => {
      let updatedList = [];
      switch (type) {
        case "categories":
          updatedList = toggleSelection(prev.listCate, item);
          return { ...prev, listCate: updatedList };
        case "actors":
          updatedList = toggleSelection(prev.listActor, item);
          return { ...prev, listActor: updatedList };
        case "characters":
          updatedList = toggleSelection(prev.listCharacter, item);
          return { ...prev, listCharacter: updatedList };
        default:
          return prev;
      }
    });
  };
  const addMovie = async () => {
    await addDocument("Movies", movie);
    handleClose();
  }
  const onchangInput = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setMovie(inner);
  };

  console.log(movie);

  return (
    <div>
      <SearchAdmin
        title={"Movies"}
        add={"Add Movies"}
        handleClickOpen={handleClickOpen}
      />
      <ModalMovie
        open={open}
        handleSeclect={handleSeclect}
        handleClose={handleClose}
        movie={movie}
        onchangInput={onchangInput}
        addMovie={addMovie}
        handleImageChange={handleImageChange}
      />
      <ModalTable />
    </div>
  );
}

export default Movies;
