import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import Movietype from "./Movietype";

function ModalMovieType({ open, handleClose, addMovietype, onchangeInput , error , movieType }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {movieType.id ? "Modal Update MovieType" : "Modal Add MovieType"}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            name="name"
            onChange={onchangeInput}
            value={movieType.name}
            error={!!error.name}
            helperText={error.name}
          />
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 2 }}
            name="description"
            onChange={onchangeInput}
            value={movieType.description}
            error={!!error.description}
            helperText={error.description}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0 }}>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="contained" autoFocus onClick={addMovietype}>
            {movieType.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ModalMovieType;
