
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { ContextPlan } from "../../../../contexts/PlanProvide";

export default function ModalPackage({
  handleClose,
  open,
  onchangeInput,
  addpkg,
  pkg,
  error,
}) {
  const Plan = React.useContext(ContextPlan);
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {pkg.id ? "Modal Edit pkg" : "Modal Add pkg"}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            options={Plan}
            fullWidth
            sx={{ mt: 2 }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Plan" />}
            onChange={(event, value) => {
              onchangeInput({
                target: { name: "PlanId", value: value.id || "" },
              });
            }}
          />
          <TextField
            id="outlined-basic"
            label="Nhập Số Tháng"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            name="months"
            
            rows={3}
            onChange={onchangeInput}
            value={pkg.months}
            error={!!error.months}
            helperText={error.months}
          />
          <TextField
            id="outlined-basic"
            label="Nhập Discount"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            name="discount"
            rows={3}
            onChange={onchangeInput}
            value={pkg.discount}
            error={!!error.discount}
            helperText={error.discount}
          />

        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0 }}>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="contained" onClick={addpkg} autoFocus>
            {pkg.id ? "UPDATE" : "ADD"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
