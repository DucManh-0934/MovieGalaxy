import React, { useContext, useRef, useState, useMemo, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./SlidesCountry.css";
import { Navigation } from "swiper/modules";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { ContextPlan } from "../../../contexts/PlanProvide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import SlidesCountryTable from "./SlidesCountryTable";
import { convertDescription, filterMoviesByCountry } from "../../../services/reponsitory";
import { fetchDocumentsByField } from "../../../services/firebaseService";
import { useNavigate } from "react-router-dom";

export default function SlidesCountry({ title }) {
  const swiperRef = useRef(null);
  const movies = useContext(ContextMovie);
  const plans = useContext(ContextPlan);
  const { isLogin } = useContext(ContextLogin);
  const [showAll, setShowAll] = useState(false);
  const [userSubs, setUserSubs] = useState([]);
  const navigate = useNavigate();

  const countryMovies = filterMoviesByCountry(movies || [], title);

  // Fetch subscription của user
  useEffect(() => {
    if (!isLogin?.id) return;
    const unsub = fetchDocumentsByField(
      "Subcriptions", "accountID", isLogin.id,
      (data) => setUserSubs(data)
    );
    return () => unsub();
  }, [isLogin]);

  const userMaxLevel = useMemo(() => {
    if (!userSubs?.length || !plans?.length) return 0;
    return userSubs.reduce((max, sub) => {
      const plan = plans.find((p) => p.id === sub.planID);
      return Math.max(max, Number(plan?.level || 0));
    }, 0);
  }, [userSubs, plans]);

  // Lấy plan của từng phim
  const getPlanForMovie = (movie) =>
    plans?.find((p) => p.id === movie?.planId);

  const handleWatch = (movie) => {
    const plan = getPlanForMovie(movie);
    const required = Number(plan?.level || 1);

    if (!isLogin) {
      navigate("/login");
      return;
    }

    if (userMaxLevel >= required) {
      navigate(`/table-watch/${movie.id}`);
    } else {
      navigate(`/rent-movie-buy/${movie.id}`);
    }
  };

  if (!countryMovies.length) return null;

  return (
    <div className="country_slide w-full group/section">
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-pink-500 bg-clip-text text-transparent">
            News {title} Movie
          </h2>
          <div className="h-[3px] w-10 mt-1 rounded-full bg-gradient-to-r from-yellow-300 via-pink-400 to-pink-500" />
        </div>
        <button
          className="text-gray-300 flex gap-1.5 items-center cursor-pointer hover:text-pink-400 transition-colors text-sm font-medium"
          onClick={() => setShowAll(true)}
        >
          See All
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Slider */}
      <div className="relative w-full">
        <button
          aria-label="Previous"
          className="opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-pink-500/80 hover:scale-110 transition-transform"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <FaChevronLeft size={14} />
        </button>

        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={14}
          slidesPerView={"auto"}
          className="w-full !overflow-visible"
        >
          {countryMovies.map((m) => {
            const plan = getPlanForMovie(m);
            const required = Number(plan?.level || 1);
            const hasAccess = isLogin && userMaxLevel >= required;

            return (
              <SwiperSlide
                key={m.id}
                className="!w-[150px] sm:!w-[170px] md:!w-[195px] lg:!w-[215px]"
              >
                <div
                  className="relative rounded-xl overflow-hidden cursor-pointer group shadow-md shadow-black/30 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1.5 transition-all duration-300"
                  onClick={() => handleWatch(m)}
                >
                  <div className="aspect-[2/3] w-full overflow-hidden bg-gray-700">
                    <img
                      src={m.imgUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                  {/* ── PLAN BADGE góc trên trái ── */}
                  {plan && (
                    <div
                      className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide"
                      style={{
                        background: hasAccess
                          ? "rgba(34,197,94,0.85)"
                          : "rgba(229,9,20,0.85)",
                        backdropFilter: "blur(6px)",
                        border: hasAccess
                          ? "1px solid rgba(134,239,172,0.4)"
                          : "1px solid rgba(255,100,100,0.4)",
                        color: "#fff",
                      }}
                    >
                      👑 {plan.title}
                    </div>
                  )}

                  {/* Tên + mô tả */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-[14px] font-semibold truncate drop-shadow">
                      {m.name}
                    </p>
                    <p className="text-gray-300 text-[11px] line-clamp-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {convertDescription(m.description || "")}
                    </p>
                  </div>

                  {/* Lock icon nếu không đủ quyền */}
                  {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
                      >
                        <span className="text-2xl">🔒</span>
                        <span>Nâng cấp để xem</span>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button
          aria-label="Next"
          className="opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-pink-500/80 hover:scale-110 transition-transform"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      {showAll && (
        <SlidesCountryTable
          title={title}
          movies={countryMovies}
          onClose={() => setShowAll(false)}
        />
      )}
    </div>
  );
}