import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { ContextPlan } from "../../../../contexts/PlanProvide";

export default function ModalFeature({
  handleClose,
  open,
  onchangeInput,
  addfeature,
  feature,
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
          {feature.id ? "Modal Edit Category" : "Modal Add Feature"}
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
            label="Name"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            name="name"
            multiline
            rows={3}
            onChange={onchangeInput}
            value={feature.name}
            error={!!error.name}
            helperText={error.name}
          />
          <FormControl sx={{ mt: 2 }} error={!!error.description}>
            <RadioGroup
              row
              name="description"
              value={feature.description}
              onChange={onchangeInput}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            {error.description && (
              <FormHelperText>{error.description}</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0 }}>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="contained" onClick={addfeature} autoFocus>
            {feature.id ? "UPDATE" : "ADD"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
