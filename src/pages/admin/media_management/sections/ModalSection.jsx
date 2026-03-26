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
export default function ModalSection({
  handleClose,
  open,
  onchangeInput,
  addSection,
  section,
  error,
  handleImageChange,
}) {
  const movies = useContext(ContextMovie);
  console.log(section);
  
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {section.id ? "Modal Edit Section" : "Modal Add Section"}
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
            value={section.name}
            error={!!error.name}
            helperText={error.name}
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
            src={section.imgUrl}
            sx={{ width: 75, height: 75, m: "auto", mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0 }}>
          <Button variant="contained" color="warning" onClick={handleClose}>
            Cancle
          </Button>
          <Button variant="contained" onClick={addSection} autoFocus>
            {section.id ? "UPDATE" : "ADD"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
