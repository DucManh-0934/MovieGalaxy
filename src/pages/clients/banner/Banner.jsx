// Banner.jsx
import React, { useContext, useState, useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaPlay, FaHeart, FaCircleInfo } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

import { FreeMode, Thumbs, Autoplay, EffectFade } from "swiper/modules";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextCategories } from "../../../contexts/CategoryProvide";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef(null);
  const movies = useContext(ContextMovie);
  const categories = useContext(ContextCategories);
  const navigate = useNavigate();

  const animeCategory = useMemo(() => {
    if (!categories) return null;
    return categories.find((c) =>
      c.name
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes("hoat hinh")
    );
  }, [categories]);

  const animeMovies = useMemo(() => {
    if (!movies || !animeCategory) return [];
    return movies.filter((m) => m.listCate?.includes(animeCategory.id));
  }, [movies, animeCategory]);

  if (!animeMovies || animeMovies.length === 0) return null;

  const currentMovie = animeMovies[activeIndex];

  const handleThumbClick = (i) => {
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideToLoop(i);
    }
  };

  // ✅ Điều hướng sang trang xem phim
  const handleWatch = (movieId) => {
    if (!movieId) return;
    navigate(`/table-watch/${movieId}`);
  };

  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden text-white bg-black">
      <Swiper
        loop={true}
        effect={"fade"}
        speed={1500}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Thumbs, Autoplay, EffectFade]}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {animeMovies.map((movie, i) => (
          <SwiperSlide key={movie.id ?? i}>
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => handleWatch(movie.id)}
            >
              <img src={movie.bannerImgUrl} className="w-full h-full object-cover" alt={movie.name} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute top-[20%] left-[5%] z-30 max-w-[40%] pointer-events-none">
        <div className="bg-black/20 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[3rem] pointer-events-auto shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase leading-tight drop-shadow-md tracking-tighter">
            {currentMovie?.name}
          </h1>

          <div className="flex flex-col mb-6">
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-[0.2em] italic mb-1">
              {currentMovie?.subTitle}
            </span>
            <div className="w-12 h-[2px] bg-yellow-400 opacity-50"></div>
          </div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3 mb-8 opacity-80 font-light">
            {currentMovie?.description}
          </p>

          <div className="flex items-center gap-4">
            {/* ✅ Nút Play điều hướng */}
            <button
              onClick={() => handleWatch(currentMovie?.id)}
              className="w-14 h-14 bg-yellow-400 hover:bg-white text-black rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 group"
            >
              <FaPlay size={18} className="ml-1 group-hover:scale-110 transition" />
            </button>
            <button className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <FaHeart size={18} />
            </button>
            {/* ✅ Nút info cũng điều hướng */}
            <button
              onClick={() => handleWatch(currentMovie?.id)}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
            >
              <FaCircleInfo size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-0 z-30 w-[50%] max-w-[50vw] overflow-hidden pr-[5%]">
        <p className="text-white/40 text-[10px] font-bold mb-4 uppercase tracking-[0.5em] ml-2 text-right">
          Gợi ý tiếp theo
        </p>

        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          slidesPerView={5}
          spaceBetween={16}
          centeredSlides={false}
          slidesPerGroup={1}
          watchSlidesProgress={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          speed={1000}
          modules={[FreeMode, Thumbs, Autoplay]}
          className="thumbSwiper w-full !overflow-visible"
        >
          {animeMovies.map((movie, i) => (
            <SwiperSlide key={movie.id ?? i} className="!w-auto">
              <div
                onClick={() => handleThumbClick(i)}
                className={`relative cursor-pointer transition-all duration-700 rounded-2xl overflow-hidden border-2 
                  w-[60px] h-[90px] md:w-[95px] md:h-[135px]
                  ${
                    activeIndex === i
                      ? "border-yellow-400 scale-110 shadow-2xl opacity-100 z-10"
                      : "border-transparent opacity-25 hover:opacity-100 scale-95"
                  }`}
              >
                <img src={movie.imgUrl} alt={movie.name} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}