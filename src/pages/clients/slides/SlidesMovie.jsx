import React, { useContext, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// CSS Swiper
import "swiper/css";
import "swiper/css/navigation";

import { demoMovie } from "../../../untils/Contants";
import View from "../ModalView/View";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { objectById } from "../../../services/reponsitory";
import { ContextCategories } from "../../../contexts/CategoryProvide";
import MovieInfor from "../cardbox/MovieInfor";

function SlidesMovie() {
  const swiperRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const movie = useContext(ContextMovie);
  const [openMovie, setOpenMovie] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const categories = useContext(ContextCategories);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenMovie = (item) => {
    setSelectedMovie(item);
    setOpenMovie(true);
  };
  const handleClickCloseMovie = () => {
    setOpenMovie(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div
      className={`w-[95%] m-auto mt-5 transition duration-300 ${open ? "scale-95 blur-sm opacity-70" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="text-xl text-white font-semibold">
          News Series Movies Today
        </div>

        <div className="flex items-center gap-2 text-white hover:text-yellow-400 cursor-pointer transition duration-300">
          <span onClick={handleClickOpen}>See All</span>
          <FaChevronRight />
        </div>
      </div>
      <div className="mt-4">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={12}
          className="flex-1"
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 6 },
            480: { slidesPerView: 2, spaceBetween: 8 },
            640: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 14 },
            1280: { slidesPerView: 6, spaceBetween: 16 },
          }}
        >
          {movie.map((e, i) => (
            <SwiperSlide key={i}>
              <div className="h-[410px]">
                <img
                  src={e.imgUrl}
                  alt=""
                  className="w-full h-full flex-1 rounded-lg"
                  onClick={() => handleClickOpenMovie(e)}
                />
              </div>
              <div className="flex flex-col mt-2">
                <p className="ml-[4%] text-white text-[17px]">{e.name}</p>
                <p className="ml-[4%] text-gray-600 text-[13px]">
                  {e.listCate
                    .map((e) => objectById(categories, e)?.name)
                    .join(" - ")}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <View
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
      />
      ;
      <MovieInfor
        openMovie={openMovie}
        handleClickCloseMovie={handleClickCloseMovie}
        selectedMovie={selectedMovie}
      />
    </div>
  );
}

export default SlidesMovie;
