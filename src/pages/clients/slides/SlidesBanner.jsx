// SlidesBanner.jsx
import React, { useContext, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaPlay, FaHeart, FaPlus } from "react-icons/fa";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "./SlidesBanner.css";

import {
  FreeMode,
  Navigation,
  Thumbs,
  Autoplay,
  EffectFade,
} from "swiper/modules";

import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextCategories } from "../../../contexts/CategoryProvide";
import { objectById } from "../../../services/reponsitory";
import { useNavigate } from "react-router-dom";

export default function SlidesBanner() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const movies = useContext(ContextMovie);
  const categories = useContext(ContextCategories);

  // ✅ Guard: chưa có data thì không render gì (tránh lỗi currentMovie undefined)
  if (!movies || movies.length === 0) {
    return (
      <div className="h-[100vh] relative overflow-hidden bg-black flex items-center justify-center">
        <p className="text-white/50">Đang tải...</p>
      </div>
    );
  }

  const handleWatch = (movieId) => {
    if (!movieId) return;
    navigate(`/table-watch/${movieId}`);
  };

  const currentMovie = movies[activeIndex];

  return (
    <div className="h-[100vh] relative overflow-hidden bg-black">
      {/* MAIN SLIDER */}
      <Swiper
        loop={true}
        effect={"fade"}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay, EffectFade]}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="main-swiper"
      >
        {movies.map((movie, i) => (
          <SwiperSlide key={movie.id ?? i}>
            <div className="slide-wrapper">
              <div className="overlay-gradient" />
              <img
                src={movie.bannerImgUrl}
                alt={movie.name}
                className="bg-image object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* CONTENT */}
      <div className="content-box">
        <div className="text-animate" key={currentMovie?.id}>
          <p className="movie-sub">
            {currentMovie?.originalTitle || "NEW RELEASE"}
          </p>
          <h1 className="movie-title">{currentMovie?.name}</h1>
        </div>

        <p className="movie-desc">{currentMovie?.description}</p>

        {/* CATEGORY */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {currentMovie?.listCate?.map((cateId, i) => {
            const cate = objectById(categories, cateId);
            if (!cate) return null;
            return (
              <div key={cateId ?? i} className="movie-tag">
                {cate.name}
              </div>
            );
          })}
        </div>

        {/* BUTTON */}
        <div className="flex items-center gap-4">
          <div
            className="play-button hover:scale-110 transition-transform cursor-pointer"
            onClick={() => handleWatch(currentMovie?.id)}
          >
            <FaPlay className="icon-play" />
          </div>

          <div className="flex gap-3 mt-[25px]">
            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all">
              <FaPlus className="text-white text-sm" />
            </button>

            <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all">
              <FaHeart className="text-white text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* THUMB */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={15}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumb-swiper"
      >
        {movies.map((movie, i) => (
          <SwiperSlide
            key={movie.id ?? i}
            className="thumb-item cursor-pointer"
          >
            <img src={movie.imgUrl} alt={movie.name} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}