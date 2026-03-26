import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import Plan from "./Plan";

function ModalPlans({
  open,
  handleClose,
  addPlan,
  onchangeInput,
  error,
  plan,
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
          {plan.id ? "Modal Update Plan" : "Modal Add Plan"}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            name="title"
            onChange={onchangeInput}
            value={plan.title}
            error={!!error.title}
            helperText={error.title}
          />
          <TextField
            id="outlined-basic"
            label="level"
            variant="outlined"
            fullWidth
            multiline
            sx={{ mt: 2 }}
            name="level"
            onChange={onchangeInput}
            value={plan.level}
            error={!!error.level}
            helperText={error.level}
          />
          <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            fullWidth
            multiline
            sx={{ mt: 2 }}
            name="price"
            onChange={onchangeInput}
            value={plan.price}
            error={!!error.price}
            helperText={error.price}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0 }}>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="contained" autoFocus onClick={addPlan}>
            {plan.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ModalPlans;
