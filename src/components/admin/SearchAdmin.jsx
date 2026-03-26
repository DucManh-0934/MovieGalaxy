import { List } from "@mui/material";
import React from "react";
import { CiSearch } from "react-icons/ci";

function SearchAdmin({ handleClickOpen, title, add ,handleSearch}) {
  return (
    <div className="flex justify-between font-serif items-center">
      <b className="text-2xl text-amber-50">{title}</b>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-56 border py-1 px-2 bg-white"
          onChange={handleSearch}
        />
        <button className="px-2 py-2 text-white bg-lime-600 rounded-r-lg ">
          <CiSearch />
        </button>
      </div>
      <button
        className="bg-lime-600 py-1 px-2 rounded-md  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 hover:text-white"
        onClick={handleClickOpen}
      >
        {add}
      </button>
    </div>
  );
}

export default SearchAdmin;
