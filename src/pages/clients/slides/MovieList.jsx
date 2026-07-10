import React, { useRef, useContext, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import MovieInfor from "../cardbox/MovieInfor";

export default function MovieList() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const movies = useContext(ContextMovie);
  const shuffledMovies = movies
    ? [...movies].sort(() => Math.random() - 0.5)
    : [];

  // ✅ State điều khiển popup MovieInfor
  const [openMovie, setOpenMovie] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleOpenMovie = (movie) => {
    setSelectedMovie(movie);
    setOpenMovie(true);
  };

  const handleCloseMovie = () => {
    setOpenMovie(false);
    setSelectedMovie(null);
  };

  return (
    <div className="p-3">
      <h1 className="font-bold text-white text-[25px] mb-4">
        Top 10 phim bộ hôm nay
      </h1>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 4 },
            480: { slidesPerView: 2, spaceBetween: 8 },
            768: { slidesPerView: 3, spaceBetween: 8 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          className="w-full"
        >
          {shuffledMovies?.map((item, i) => (
            <SwiperSlide key={item.id || i}>
              {/* ✅ Đổi Link thành div + onClick mở popup */}
              <div
                onClick={() => handleOpenMovie(item)}
                className="block group cursor-pointer"
              >
                <div
                  className="relative w-full aspect-[2/3] overflow-hidden rounded-lg bg-black border border-transparent hover:border-[#ffd875] transition"
                  style={{
                    clipPath:
                      i % 2 === 0
                        ? "polygon(0 0, 5% 0, 100% 5%, 100% 100%, 0 100%)"
                        : "polygon(95% 0, 100% 0, 100% 100%, 0 100%, 0 5%)",
                  }}
                >
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 flex items-end justify-center">
                    <span className="bg-gray-500 text-xs px-2 py-1 rounded-l text-white">
                      PD
                    </span>
                    <span className="bg-green-500/70 text-xs px-2 py-1 rounded-r text-white">
                      LT
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="text-[#ffd875] font-bold text-[55px] italic">
                    {i + 1}
                  </p>
                  <div className="gap-2 p-1">
                    <h3 className="text-sm px-2 mt-2 text-white line-clamp-1">
                      {item.name}
                    </h3>

                    <h3 className="text-[12px] px-2 text-gray-500 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="text-white hidden md:flex text-sm gap-2 px-2">
                      <h1 className="font-bold">T16</h1>
                      <span className="font-bold">•</span>
                      <h1>Phan 1 </h1>
                      <span className="font-bold">•</span>
                      <h1>Tap hoan tat (40/40)</h1>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* NAV BUTTONS (optional) */}
        <button ref={prevRef} className="hidden" />
        <button ref={nextRef} className="hidden" />
      </div>

      {/* ✅ Popup thông tin phim */}
      <MovieInfor
        openMovie={openMovie}
        handleClickCloseMovie={handleCloseMovie}
        selectedMovie={selectedMovie}
      />
    </div>
  );
}