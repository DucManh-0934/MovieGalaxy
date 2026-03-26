import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Avatar, styled, TextField } from "@mui/material";
import { FaFileUpload } from "react-icons/fa";

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
export default function ModalCharactor({
  handleImageChange,
  handleClose,
  open,
  addCharactor,
  onchangeInput,
  charactor,
  error,
}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Modal Add Charactor"}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            sx={{ mt: 2 }}
            onChange={onchangeInput}
            value={charactor.name}
            error={!!error.name}
            helperText={error.name}
          />
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            name="description"
            rows={2}
            sx={{ mt: 2 }}
            onChange={onchangeInput}
            value={charactor.description}
            error={!!error.description}
            helperText={error.description}
          />
          <Button
            sx={{ mt: 2 }}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<FaFileUpload />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageChange}
              multiple
            />
          </Button>
          <Avatar
            alt="Remy Sharp"
            src={charactor.imgUrl}
            sx={{ width: 75, height: 75, m: "auto", mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="contained" onClick={addCharactor} autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
