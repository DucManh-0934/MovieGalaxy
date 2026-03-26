import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ModalDeleted({openDelete , handleCloseDelete,handleDeleted}) {
  return (
    <React.Fragment>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Modal Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You really want to Deleted! ...........
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleCloseDelete}>Cancle</Button>
          <Button autoFocus variant='contained' color='error' onClick={handleDeleted} >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
