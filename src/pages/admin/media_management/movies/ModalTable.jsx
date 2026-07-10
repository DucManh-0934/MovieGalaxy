import React, { useContext } from "react";
import { ContextMovie } from "../../../../contexts/MoviePrivide";

function ModalTable(props) {
    const movies = useContext(ContextMovie);
  return (
    <div className="grid min-lg:grid-cols-4 min-md:grid-cols-3 grid-cols-2 gap-4 mt-5 ">
        {movies.map((movie) => (
          <div key={movie.id} className="col-span text-white flex flex-col items-center  opacity-75 hover:-translate-y-2 transition-all duration-300  group">
            <img
              src={movie.imgUrl}
              alt={movie.title}
              className="object-cover rounded-lg w-80 h-40 z-20"
            />
            <div className="p-2 w-full group-hover:opacity-100 bg-gray-500 group-hover:-translate-y-5 transition-all duration-500 opacity-0 text-amber-300 mt-3">
                <p>{movie.name}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ModalTable;
