import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";

export default function ModalCategory({
  handleClose,
  open,
  onchangeInput,
  addCategory,
  category,
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
          {category.id ? "Modal Edit Category" : "Modal Add Category"}
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
              value={category.name}
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
              value={category.description}
              error={!!error.description}
              helperText={error.description}
            />
        </DialogContent>
        <DialogActions sx={{px : 3 , pt :0}}>
          <Button  variant="contained" color="warning" onClick={handleClose}>Cancle</Button>
          <Button variant="contained"  onClick={addCategory} autoFocus >
            {category.id ? "UPDATE" : "ADD"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
