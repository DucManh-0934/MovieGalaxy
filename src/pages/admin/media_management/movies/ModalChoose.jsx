import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";

export default function ModalChoose({
  openModal,
  handleCloseModal,
  dataChoose,
  keyChoose,
  handleSeclect,
  dataSelect,
  setSearch,search
}) {
  
  const check = (id) => {
    return dataSelect.includes(id);
  };
  const dataSearch = dataChoose.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const searchData = (e) =>{
    setSearch(e.target.value);
  }
  return (
    <React.Fragment>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title" className="flex justify-between ">
          {"Modal Choose"}
          <input
            type="text"
            onChange={searchData}
            placeholder="Enter Keywords"
            className="text-sm px-2 border-1 rounded-sm"
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="flex  gap-2 flex-wrap">
              {dataSearch.map((item) => (
                <>
                  {" "}
                  {keyChoose === "categories" ? (
                    <button
                      onClick={() => handleSeclect(item.id, keyChoose)}
                      key={item.id}
                      className={
                        check(item.id)
                          ? "border-1 px-2 py-1 text-xl rounded-sm border-gray-300 text-gray-300"
                          : "border-1 px-2 py-1 text-xl rounded-sm border-green-600 text-green-600"
                      }
                    >
                      {item.name}
                    </button>
                  ) : (
                    <div
                      onClick={() => handleSeclect(item.id, keyChoose)}
                      className="flex gap-3 flex-col"
                    >
                      <img
                        src={item.imgUrl}
                        alt=""
                        className={
                          check(item.id)
                            ? "w-15 h-15 rounded-full border-2 border-green-600"
                            : "w-15 h-15 rounded-full border-2"
                        }
                      />
                      <p>{item.name}</p>
                    </div>
                  )}
                </>
              ))}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Disagree</Button>
          <Button onClick={handleCloseModal} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
