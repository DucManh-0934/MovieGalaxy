import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Avatar, TextField } from "@mui/material";
import { FaFileUpload } from "react-icons/fa";
import styled from "@emotion/styled";
import { useContext } from "react";
import { ContextMovie } from "../../../../contexts/MoviePrivide";
import { ContextSection } from "../../../../contexts/SectionPrivide";
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
export default function ModalEpisode({
  handleClose,
  open,
  onchangeInput,
  addEpisode,
  episode,
  error,
  handleImageChange,
}) {
  const movies = useContext(ContextMovie);
  const sections = useContext(ContextSection);
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {episode.id ? "Modal Edit Episode" : "Modal Add Episode"}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Episode Number"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            type="number"
            name="episodeNumber"
            onChange={onchangeInput}
            value={episode.episodeNumber}
            error={!!error.episodeNumber}
            helperText={error.episodeNumber}
          />
          <Autocomplete
            options={movies}
            sx={{ width: 300, mt: 2 }}

            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Movie" />}
            onChange={(event, value) => {
              onchangeInput({
                target: { name: "movieId", value: value.id || "" },
              });
            }}
          />
          <Autocomplete
            options={movies}
            sx={{ width: 300, mt: 2 }}

            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Section" />}
            onChange={(event, value) => {
              onchangeInput({
                target: { name: "sectionId", value: value.id || "" },
              });
            }}
          />
            <TextField
            id="outlined-basic"
            label="Episode Url"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            name="url"
            onChange={onchangeInput}
            value={episode.url}
            error={!!error.url}
            helperText={error.url}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0 }}>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="contained" onClick={addEpisode} autoFocus>
            {episode.id ? "UPDATE" : "ADD"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
