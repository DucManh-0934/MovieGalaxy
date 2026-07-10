import React, { useContext, useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoMenu } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

import { ContextCategories } from "../../contexts/CategoryProvide";
import { countries } from "../../untils/Contants";
import Auth from "../../pages/clients/auth/Auth";
import { ContextLogin } from "../../contexts/LoginProvide";
import { ContextMovie } from "../../contexts/MoviePrivide";
import { ContextPlan } from "../../contexts/PlanProvide";
import { objectById } from "../../services/reponsitory";
import { fetchDocumentsByField } from "../../services/firebaseService";
import AuInformation from "../../pages/clients/infor/AuInformation";
import { Link, useNavigate } from "react-router-dom"; // 👈 thêm useNavigate

function Header() {
  const categories = useContext(ContextCategories);
  const movie = useContext(ContextMovie);
  const Plan = useContext(ContextPlan);
  const { isLogin, handleLogout } = useContext(ContextLogin);
  const navigate = useNavigate(); // 👈 thêm dòng này

  // ── Gói VIP đang đăng ký (nếu có) ──
  const [mySubscriptions, setMySubscriptions] = useState([]);

  useEffect(() => {
    if (!isLogin?.id) {
      setMySubscriptions([]);
      return;
    }
    const unsubscribe = fetchDocumentsByField(
      "Subcriptions",
      "accountID",
      isLogin.id,
      setMySubscriptions,
    );
    return () => unsubscribe && unsubscribe();
  }, [isLogin?.id]);

  // Lấy gói mới nhất user đã đăng ký (nếu có nhiều bản ghi thì lấy cái cuối)
  const currentSubscription = mySubscriptions?.[mySubscriptions.length - 1];
  const currentPlan = objectById(Plan || [], currentSubscription?.planID);
  const isVip = !!currentSubscription;

  const [keyword, setKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showCountry, setShowCountry] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const userRef = useRef();
  const categoryRef = useRef();
  const countryRef = useRef();
  const menuRef = useRef();
  const searchRef = useRef();
  const [openInfor, setOpenInfor] = React.useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !categoryRef.current?.contains(e.target) &&
        !countryRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target) &&
        !userRef.current?.contains(e.target) &&
        !searchRef.current?.contains(e.target)
      ) {
        setShowCategory(false);
        setShowCountry(false);
        setShowMenu(false);
        setShowUserMenu(false);
        setShowSearch(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClickOpenInfor = () => {
    setOpenInfor(true);
  };

  const handleCloseInfor = () => {
    setOpenInfor(false);
  };

  useEffect(() => {
    if (keyword.trim() === "") {
      setShowSearch(false);
    }
  }, [keyword]);

  // ✅ Điều hướng tới trang xem phim khi click 1 kết quả search
  const handleWatchFromSearch = (movieId) => {
    if (!movieId) return;
    setShowSearch(false);
    setKeyword("");
    navigate(`/table-watch/${movieId}`);
  };

  const filteredMovies = movie?.filter((m) =>
    m.name?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <div className="fixed w-full z-50 flex justify-between items-center p-3 bg-black/30 backdrop-blur-md text-white">
      <div className="flex items-center gap-5">
        <Link to="/">
          <img src={logo} className="w-20" alt="" />
        </Link>
        <div ref={searchRef} className="relative hidden lg:flex items-center">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => {
              if (keyword.trim() !== "") {
                setShowSearch(true);
              }
            }}
            placeholder="Search movie..."
            className="w-75 pl-10 p-2 bg-transparent border border-gray-500 rounded text-white"
          />
          <FaMagnifyingGlass className="absolute left-3" />

          {showSearch && (
            <div className="absolute top-full left-0 w-full bg-black/90 mt-2 rounded-lg max-h-96 overflow-y-auto z-50">
              <p className="p-3 text-gray-400 text-sm">Danh sách phim</p>

              {filteredMovies?.length > 0 ? (
                filteredMovies.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => handleWatchFromSearch(e.id)} // 👈 thêm dòng này
                    className="flex gap-3 p-3 hover:bg-white/10 cursor-pointer"
                  >
                    <img
                      src={e.imgUrl}
                      alt=""
                      className="w-12 h-16 object-cover rounded"
                    />

                    <div>
                      <p className="text-sm font-semibold">{e.name}</p>
                      <p className="text-xs text-gray-400">
                        {e.listCate
                          ?.map(
                            (cateId) => objectById(categories, cateId)?.name,
                          )
                          .join(" - ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {e.duration} Phút • {e.countryId}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-400 text-sm">Không tìm thấy phim</p>
              )}
            </div>
          )}
        </div>
        {/* MOBILE MENU BUTTON */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu((prev) => !prev);
          }}
          className="lg:hidden text-3xl cursor-pointer"
        >
          {showMenu ? <TiDelete /> : <IoMenu />}
        </div>

        {/* MENU */}
        <div
          ref={menuRef}
          className={`
            absolute lg:static top-full left-0 w-full lg:w-auto
            bg-gray-800 lg:bg-transparent
            lg:flex gap-5 p-5 lg:p-0
            grid grid-cols-2 lg:grid-cols-none
            ${showMenu ? "block" : "hidden"} lg:flex
          `}
        >
          <p className="cursor-pointer hover:text-amber-400">Chủ Đề</p>

          {/* CATEGORY */}
          <div
            ref={categoryRef}
            className="relative cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowCategory((prev) => !prev);
            }}
          >
            <div className="flex items-center gap-1">
              Thể Loại <FaCaretDown />
            </div>

            {showCategory && (
              <div className="absolute top-full mt-2 w-60 bg-black/80 rounded-lg p-3 grid grid-cols-2 z-50">
                {categories?.map((e, i) => (
                  <p key={i} className="hover:text-amber-400 cursor-pointer">
                    {e.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          <p className="cursor-pointer hover:text-amber-400">Phim Lẻ</p>
          <p className="cursor-pointer hover:text-amber-400">Phim Bộ</p>

          {/* COUNTRY */}
          <div
            ref={countryRef}
            className="relative cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowCountry((prev) => !prev);
            }}
          >
            <div className="flex items-center gap-1">
              Quốc Gia <FaCaretDown />
            </div>

            {showCountry && (
              <div className="absolute top-full mt-2 w-60 bg-black/80 rounded-lg p-3 grid grid-cols-2 z-50">
                {countries.map((e, i) => (
                  <p key={i} className="hover:text-amber-400 cursor-pointer">
                    {e}
                  </p>
                ))}
              </div>
            )}
          </div>

          <p className="cursor-pointer hover:text-amber-400">Diễn Viên</p>
          <p className="cursor-pointer hover:text-amber-400">Lịch Chiếu</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        <FaMagnifyingGlass className="lg:hidden text-xl cursor-pointer" />

        <div className="relative" ref={userRef}>
          {isLogin ? (
            <>
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu((prev) => !prev);
                }}
              >
                <img
                  src={isLogin.imgUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: "#0f0f17",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Banner */}
                  <div
                    style={{
                      height: 64,
                      background: "linear-gradient(135deg, #e50914, #7b0000)",
                    }}
                  />

                  {/* Avatar + Info (căn giữa, nằm dưới banner, tránh bị đè) */}
                  <div className="px-4 pb-4 flex flex-col items-center text-center">
                    <div
                      className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                      style={{
                        border: "3px solid #0f0f17",
                        marginTop: -32,
                      }}
                    >
                      <img
                        src={isLogin.imgUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>

                    <p className="text-white font-semibold text-sm mt-2 truncate max-w-full">
                      {isLogin.name}
                    </p>
                    <p
                      className="text-xs truncate max-w-full"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {isLogin.email}
                    </p>

                    {/* Level VIP hiện tại, ngay dưới gmail */}
                    <span
                      className="inline-flex items-center gap-1 mt-2 mb-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={
                        isVip
                          ? {
                              background: "rgba(201,168,76,0.15)",
                              color: "#c9a84c",
                              border: "1px solid rgba(201,168,76,0.4)",
                            }
                          : {
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }
                      }
                    >
                      {isVip
                        ? `👑 ${currentPlan?.title || "Thành viên VIP"}`
                        : "Free"}
                    </span>

                    {/* Nút Đăng ký / Nâng cấp gói - luôn hiển thị để lên gói cao hơn */}
                    <Link
                      to="/register-pack"
                      className="w-full mb-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                      style={{
                        background: isVip
                          ? "linear-gradient(135deg, #c9a84c, #8a6d1f)"
                          : "linear-gradient(135deg, #e50914, #ff6b00)",
                        color: "#fff",
                        boxShadow: isVip
                          ? "0 0 12px rgba(201,168,76,0.35)"
                          : "0 0 12px rgba(229,9,20,0.4)",
                        letterSpacing: "0.03em",
                      }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      {isVip ? "👑 Nâng cấp gói" : "👑 Đăng ký gói VIP"}
                    </Link>

                    {/* Thuê phim Button */}
                    <Link
                      to="/rent-movie"
                      className="w-full mb-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                        color: "#c9a84c",
                        border: "1px solid rgba(201,168,76,0.4)",
                        letterSpacing: "0.03em",
                      }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      🎬 Thuê phim
                    </Link>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {[
                        ["0", "Đã xem"],
                        ["0", "Yêu thích"],
                        [isVip ? currentPlan?.title || "VIP" : "Free", "Gói"],
                      ].map(([val, label], i) => (
                        <div
                          key={i}
                          className="text-center py-2 rounded-xl"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{ color: i === 2 ? "#e50914" : "#fff" }}
                          >
                            {val}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Menu */}
                    <Link
                      to={"/auinformation"}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/5"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                      onClick={handleClickOpenInfor}
                    >
                      👤 Thông tin cá nhân
                    </Link>
                    <button
                      className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white/5"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      ❤️ Phim yêu thích
                    </button>
                    <hr
                      style={{
                        borderColor: "rgba(255,255,255,0.07)",
                        margin: "4px 0",
                      }}
                    />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2"
                      style={{ color: "#ff6b6b" }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(229,9,20,0.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleOpenLogin}
              className="hidden lg:flex items-center gap-2 bg-white text-black px-3 py-1 rounded-full"
            >
              <VscAccount />
              Đăng Nhập
            </button>
          )}
        </div>
      </div>

      <Auth openLogin={openLogin} handleClose={() => setOpenLogin(false)} />
    </div>
  );
}

export default Header;