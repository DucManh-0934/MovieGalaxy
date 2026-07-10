import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, IconButton, Typography, Box, Button,
} from "@mui/material";
import {
  FaPlay, FaTimes, FaHeart, FaStar, FaClock, FaFilm, FaFolderPlus,
} from "react-icons/fa";
import { ContextEpisode } from "../../../contexts/EpisodeProvide";
import {
  addDocument, deleteDocument, fetchDocumentsByField, updateDocument,
} from "../../../services/firebaseService";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { ContextLikes } from "../../../contexts/LikeProvide";
import { ContextPlan } from "../../../contexts/PlanProvide";

export default function MovieInfor({ openMovie, handleClickCloseMovie, selectedMovie }) {
  const movie = selectedMovie;
  const navigate = useNavigate();
  const episodes = React.useContext(ContextEpisode);
  const { isLogin } = React.useContext(ContextLogin);
  const like = React.useContext(ContextLikes);
  const plans = React.useContext(ContextPlan);

  // ── PLAYLIST ──
  const [openPlaylist, setOpenPlaylist] = React.useState(false);
  const [playlists, setPlaylists] = React.useState([]);
  const [addingTo, setAddingTo] = React.useState(null);
  const [toast, setToast] = React.useState("");

  // ── USER SUBSCRIPTION ──
  const [userSubs, setUserSubs] = React.useState([]);

  React.useEffect(() => {
    if (!isLogin?.id) return;
    const unsub = fetchDocumentsByField(
      "Subcriptions",
      "accountID",
      isLogin.id,
      (data) => setUserSubs(data)
    );
    return () => unsub();
  }, [isLogin]);

  // Level cao nhất user đang có (0 = chưa có gói nào)
  const userMaxLevel = React.useMemo(() => {
    if (!userSubs?.length || !plans?.length) return 0;
    return userSubs.reduce((max, sub) => {
      const plan = plans.find((p) => p.id === sub.planID);
      return Math.max(max, Number(plan?.level || 0));
    }, 0);
  }, [userSubs, plans]);

  // Level yêu cầu của phim (mặc định 1)
  const movieRequiredLevel = React.useMemo(() => {
    if (!plans?.length || !movie?.planId) return 1;
    const plan = plans.find((p) => p.id === movie.planId);
    return Number(plan?.level || 1);
  }, [plans, movie]);

  // ── HANDLE WATCH ──
  const handleWatch = () => {
    handleClickCloseMovie();

    if (!isLogin) {
      navigate("/login");
      return;
    }

    if (userMaxLevel >= movieRequiredLevel) {
      // Đủ điều kiện → xem phim
      navigate(`/table-watch/${movie.id}`);
    } else {
      // Không đủ → sang trang chọn gói / thuê lẻ
      navigate(`/rent-movie-buy/${movie.id}`);
    }
  };

  // ── EPISODES ──
  const showMovie = React.useMemo(() => {
    if (!episodes || !movie?.id) return [];
    return episodes.filter((e) => e.movieId === movie.id);
  }, [episodes, movie]);

  const sortMovie = [...showMovie].sort((a, b) => a.episodeNumber - b.episodeNumber);

  // ── LIKES ──
  const checkfilm = () =>
    like?.find((e) => e.movieId == movie?.id && e.accountId == isLogin?.id);

  const addSave = async () => {
    const likeObj = { movieId: movie.id, accountId: isLogin.id };
    if (checkfilm()) {
      await deleteDocument("Likes", checkfilm());
    } else {
      await addDocument("Likes", likeObj);
    }
  };

  // ── PLAYLIST ──
  React.useEffect(() => {
    if (!openPlaylist || !isLogin?.id) return;
    const unsub = fetchDocumentsByField("playlists", "creatorId", isLogin.id, (data) => {
      setPlaylists(data);
    });
    return () => unsub();
  }, [openPlaylist, isLogin]);

  const isInPlaylist = (playlist) => (playlist.movies ?? []).includes(movie?.id);

  const handleAddToPlaylist = async (playlist) => {
    if (addingTo) return;
    setAddingTo(playlist.id);
    const movies = playlist.movies ?? [];
    const alreadyIn = isInPlaylist(playlist);
    const updated = alreadyIn ? movies.filter((id) => id !== movie.id) : [...movies, movie.id];
    await updateDocument("playlists", { id: playlist.id, movies: updated, count: updated.length });
    showToast(alreadyIn ? `Đã xóa khỏi "${playlist.folderName}"` : `Đã thêm vào "${playlist.folderName}"`);
    setAddingTo(null);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // Nhãn nút Xem phim — thay đổi theo quyền
  const watchBtnLabel = React.useMemo(() => {
    if (!isLogin) return "Đăng nhập để xem";
    if (userMaxLevel >= movieRequiredLevel) return "Xem phim";
    if (movieRequiredLevel === 1) return "Chọn gói xem";        // lv1: chỉ gói
    return "Thuê / Đăng ký xem";                                // lv2+: thuê lẻ hoặc gói
  }, [isLogin, userMaxLevel, movieRequiredLevel]);

  return (
    <Dialog
      open={openMovie}
      onClose={handleClickCloseMovie}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { background: "transparent", boxShadow: "none", overflow: "visible" } }}
      BackdropProps={{ sx: { backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.75)" } }}
    >
      <DialogContent sx={{ p: 0, overflow: "visible" }}>
        <Box sx={{
          position: "relative", borderRadius: "20px", overflow: "hidden",
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(229,9,20,0.15)",
        }}>

          {/* BG GLOW */}
          <Box sx={{
            position: "absolute", top: -60, right: -60, width: 300, height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* CLOSE */}
          <IconButton onClick={handleClickCloseMovie} sx={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 36, height: 36,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", transition: "all 0.2s ease",
            "&:hover": { background: "rgba(229,9,20,0.3)", color: "#fff", border: "1px solid rgba(229,9,20,0.5)", transform: "rotate(90deg)" },
          }}>
            <FaTimes size={14} />
          </IconButton>

          <Box display="flex" sx={{ minHeight: 420 }}>
            {/* POSTER */}
            <Box sx={{ position: "relative", flexShrink: 0, width: { xs: "100%", sm: 240 }, display: { xs: "none", sm: "block" } }}>
              <Box component="img" src={movie?.imgUrl} alt="poster"
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, #1a1a2e 100%)" }} />
              <Box sx={{
                position: "absolute", top: 16, left: 16,
                display: "flex", alignItems: "center", gap: "5px",
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,193,7,0.3)", borderRadius: "8px", px: 1.2, py: 0.6,
              }}>
                <FaStar color="#ffc107" size={11} />
                <Typography sx={{ color: "#ffc107", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
                  {movie?.rating || "8.5"}
                </Typography>
              </Box>

              {/* LEVEL BADGE */}
              {movieRequiredLevel > 1 && (
                <Box sx={{
                  position: "absolute", bottom: 16, left: 16,
                  background: "rgba(229,9,20,0.85)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px",
                  px: 1.2, py: 0.5,
                }}>
                  <Typography sx={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>
                    👑 Gói Level {movieRequiredLevel}+
                  </Typography>
                </Box>
              )}
            </Box>

            {/* INFO */}
            <Box display="flex" flexDirection="column" sx={{ flex: 1, p: { xs: 3, sm: "32px 32px 28px 28px" } }}>
              <Box display="flex" gap={1} mb={1.5} flexWrap="wrap">
                {[movie?.genre || "Hành động", movie?.year || "2025"].map((tag, i) => (
                  <Box key={i} sx={{
                    px: 1.5, py: 0.4, borderRadius: "6px",
                    background: i === 0 ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.06)",
                    border: i === 0 ? "1px solid rgba(229,9,20,0.35)" : "1px solid rgba(255,255,255,0.1)",
                    color: i === 0 ? "#ff6b6b" : "rgba(255,255,255,0.5)",
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase",
                  }}>{tag}</Box>
                ))}
              </Box>

              <Typography sx={{
                fontFamily: "'Georgia', serif", fontSize: { xs: 22, sm: 26 },
                fontWeight: 700, color: "#fff", lineHeight: 1.2, mb: 0.5, letterSpacing: "-0.3px",
              }}>
                {movie?.name}
              </Typography>

              <Box sx={{ width: 48, height: 3, borderRadius: 2, background: "linear-gradient(90deg, #e50914, #ff6b6b)", mb: 2 }} />

              <Box display="flex" gap={2.5} mb={2} flexWrap="wrap">
                {[
                  { icon: <FaClock size={11} />, label: "120 phút" },
                  { icon: <FaFilm size={11} />, label: movie?.genre || "Hành động" },
                  { icon: <FaStar size={11} />, label: `${movie?.rating || "8.5"} / 10` },
                ].map((item, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={0.7}>
                    <Box sx={{ color: "rgba(229,9,20,0.8)" }}>{item.icon}</Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography sx={{
                color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.75, mb: 3,
                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {movie?.description || "Chưa có mô tả cho bộ phim này."}
              </Typography>

              <Box mt="auto">
                <Box display="flex" gap={1.5} mb={2.5} flexWrap="wrap">

                  {/* XEM PHIM — label thay đổi theo quyền */}
                  <Button
                    onClick={handleWatch}
                    startIcon={<FaPlay size={11} />}
                    sx={{
                      background: userMaxLevel >= movieRequiredLevel
                        ? "linear-gradient(135deg, #e50914 0%, #c1121f 100%)"
                        : "linear-gradient(135deg, #c9a84c 0%, #a07830 100%)",
                      color: userMaxLevel >= movieRequiredLevel ? "#fff" : "#1a1000",
                      px: 3, py: 1, borderRadius: "10px", fontWeight: 700, fontSize: 13,
                      boxShadow: userMaxLevel >= movieRequiredLevel
                        ? "0 4px 20px rgba(229,9,20,0.4)"
                        : "0 4px 20px rgba(201,168,76,0.3)",
                      transition: "all 0.25s ease",
                      "&:hover": { transform: "translateY(-1px)", opacity: 0.9 },
                    }}
                  >
                    {watchBtnLabel}
                  </Button>

                  {/* YÊU THÍCH */}
                  <Button
                    startIcon={<FaHeart size={11} />}
                    onClick={addSave}
                    sx={{
                      background: checkfilm() ? "rgba(229,9,20,0.25)" : "rgba(255,255,255,0.06)",
                      color: checkfilm() ? "#ff6b6b" : "rgba(255,255,255,0.75)",
                      px: 2.5, py: 1, borderRadius: "10px", fontWeight: 600, fontSize: 13,
                      border: checkfilm() ? "1px solid rgba(229,9,20,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)", transition: "all 0.25s ease",
                      "&:hover": { background: "rgba(229,9,20,0.35)", border: "1px solid rgba(229,9,20,0.5)", color: "#ff6b6b" },
                    }}
                  >
                    {checkfilm() ? "Đã yêu thích" : "Yêu thích"}
                  </Button>

                  {/* DANH SÁCH */}
                  <Button
                    startIcon={<FaFolderPlus size={11} />}
                    onClick={() => setOpenPlaylist(true)}
                    sx={{
                      background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)",
                      px: 2.5, py: 1, borderRadius: "10px", fontWeight: 600, fontSize: 13,
                      border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
                      transition: "all 0.25s ease",
                      "&:hover": { background: "rgba(99,153,34,0.2)", border: "1px solid rgba(99,153,34,0.4)", color: "#a8d870" },
                    }}
                  >
                    Danh sách
                  </Button>
                </Box>

                {/* EPISODES */}
                <Box>
                  <Typography sx={{
                    color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600,
                    letterSpacing: "1px", textTransform: "uppercase", mb: 1.2,
                  }}>
                    Danh sách tập
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {sortMovie.map((ep, i) => (
                      <Button key={i} onClick={handleWatch} size="small" startIcon={<FaPlay size={9} />} sx={{
                        minWidth: "unset", px: 1.8, py: 0.6, borderRadius: "8px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 500, transition: "all 0.2s ease",
                        "&:hover": { background: "rgba(229,9,20,0.2)", border: "1px solid rgba(229,9,20,0.4)", color: "#fff", transform: "translateY(-1px)" },
                      }}>
                        Tập {ep.episodeNumber}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* PLAYLIST POPUP */}
          {openPlaylist && (
            <Box onClick={() => setOpenPlaylist(false)} sx={{
              position: "absolute", inset: 0, zIndex: 20,
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "20px",
            }}>
              <Box onClick={(e) => e.stopPropagation()} sx={{
                background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
                p: 2.5, width: 300, maxHeight: 400, overflowY: "auto",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: 2 },
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Thêm vào danh sách</Typography>
                  <IconButton size="small" onClick={() => setOpenPlaylist(false)} sx={{
                    width: 28, height: 28, color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    "&:hover": { color: "#ff6b6b", background: "rgba(229,9,20,0.2)", transform: "rotate(90deg)" },
                  }}>
                    <FaTimes size={11} />
                  </IconButton>
                </Box>

                {!isLogin?.id && (
                  <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "center", py: 3 }}>
                    Vui lòng đăng nhập để sử dụng tính năng này
                  </Typography>
                )}
                {isLogin?.id && playlists.length === 0 && (
                  <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "center", py: 3 }}>
                    Bạn chưa có danh sách nào.<br />Hãy tạo danh sách trong trang Yêu thích.
                  </Typography>
                )}
                {isLogin?.id && playlists.length > 0 && (
                  <Box display="flex" flexDirection="column" gap={1}>
                    {playlists.map((pl) => {
                      const added = isInPlaylist(pl);
                      const isLoading = addingTo === pl.id;
                      return (
                        <Box key={pl.id} onClick={() => !isLoading && handleAddToPlaylist(pl)} sx={{
                          display: "flex", alignItems: "center", gap: 1.5, p: "10px 14px",
                          borderRadius: "10px", cursor: isLoading ? "wait" : "pointer",
                          background: added ? "rgba(99,153,34,0.15)" : "rgba(255,255,255,0.04)",
                          border: added ? "1px solid rgba(99,153,34,0.4)" : "1px solid rgba(255,255,255,0.07)",
                          opacity: isLoading ? 0.6 : 1, transition: "all 0.2s ease",
                          "&:hover": { background: added ? "rgba(99,153,34,0.25)" : "rgba(255,255,255,0.08)", transform: "translateX(2px)" },
                        }}>
                          <Box sx={{ width: 40, height: 40, borderRadius: "8px", background: "#0d2137", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <FaFilm size={16} color="rgba(255,255,255,0.15)" />
                          </Box>
                          <Box flex={1} minWidth={0}>
                            <Typography noWrap sx={{ fontSize: 13, fontWeight: 600, color: added ? "#a8d870" : "#fff" }}>
                              {pl.folderName}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mt: "2px" }}>
                              {pl.count ?? 0} phim
                            </Typography>
                          </Box>
                          {added && (
                            <Box sx={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(99,153,34,0.25)", border: "1px solid rgba(99,153,34,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Typography sx={{ color: "#a8d870", fontSize: 11, lineHeight: 1 }}>✓</Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* TOAST */}
      {toast && (
        <Box sx={{
          position: "fixed", bottom: 24, right: 24,
          background: "rgba(15,30,50,0.95)", border: "1px solid rgba(99,153,34,0.4)",
          color: "#a8d870", px: 2.5, py: 1.5, borderRadius: "12px",
          fontSize: 13, fontWeight: 600, zIndex: 9999,
          backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", gap: 1,
          animation: "fadeInUp 0.25s ease",
          "@keyframes fadeInUp": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        }}>
          ✓ {toast}
        </Box>
      )}
    </Dialog>
  );
}