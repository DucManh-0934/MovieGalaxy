import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Avatar, TextField } from "@mui/material";
import { FaFileUpload } from "react-icons/fa";
import styled from "@emotion/styled";
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
export default function ModalActor({
  open,
  handleClose,
  onchangeInput,
  addActor,
  actor,
  handleImageChange,
}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Modal Add Actor"}</DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            sx={{ mt: 2 }}
            value={actor.name}
            onChange={onchangeInput}
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
            value={actor.description}
            onChange={onchangeInput}
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
              multiple
              onChange={handleImageChange}
            />
          </Button>
          <Avatar
            alt="Remy Sharp"
            src={actor.imgUrl}
            sx={{ width: 75, height: 75, m: "auto", mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button>Disagree</Button>
          <Button onClick={addActor}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
