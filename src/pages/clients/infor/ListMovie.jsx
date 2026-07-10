import React, { useContext, useState, useEffect } from "react";
import {
  FaPlus,
  FaPlay,
  FaTrash,
  FaStar,
  FaFilm,
  FaSearch,
  FaTimes,
  FaTh,
  FaList,
  FaLayerGroup,
} from "react-icons/fa";

import { ContextLogin } from "../../../contexts/LoginProvide";
import { ContextMovie } from "../../../contexts/MoviePrivide";
import { objectById } from "../../../services/reponsitory";

import {
  addDocument,
  updateDocument,
  deleteDocument,
  fetchDocumentsByField,
} from "../../../services/firebaseService";

import PlaylistModal from "./PlaylistModal";
import DialogListMovie from "./DialogListMovie";
import { useNavigate } from "react-router-dom";

export default function ListMovie() {
  const movies = useContext(ContextMovie);
  const navigate = useNavigate();

  const { isLogin } = useContext(ContextLogin);
  const uid = isLogin?.id;

  const [playlists, setPlaylists] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  const [removing, setRemoving] = useState(null);

  // ================= REALTIME FIRESTORE =================
  useEffect(() => {
    if (!uid) return;

    const unsubscribe = fetchDocumentsByField(
      "playlists",
      "creatorId",
      uid,
      (data) => {
        setPlaylists(data);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [uid]);
  const handleWatch = () => {
    navigate(`/table-watch/${movie.id}`);
  };

  // Sync selectedPlaylist khi playlists thay đổi (realtime)
  useEffect(() => {
    if (!selectedPlaylist) return;
    const updated = playlists.find((p) => p.id === selectedPlaylist.id);
    if (updated) setSelectedPlaylist(updated);
  }, [playlists]);

  // ================= TOAST =================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  // ================= THÊM PLAYLIST =================
  const handleAdd = async (name) => {
    if (playlists.length >= 5) {
      showToast("Bạn chỉ được tạo tối đa 5 danh sách!");
      return;
    }
    try {
      await addDocument("playlists", {
        creatorId: uid,
        folderName: name,
      });
      showToast("Tạo danh sách thành công");
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra!");
    }
  };

  // ================= SỬA PLAYLIST =================
  const handleEdit = async (name) => {
    try {
      const playlist = playlists[modal.index];
      await updateDocument("playlists", {
        id: playlist.id,
        folderName: name,
      });
      showToast("Cập nhật danh sách thành công");
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra!");
    }
  };

  // ================= XÓA PLAYLIST =================
  const handleDelete = async () => {
    try {
      const playlist = playlists[modal.index];
      setRemoving(playlist.id);
      await deleteDocument("playlists", { id: playlist.id });
      showToast("Đã xóa danh sách");
      setModal(null);
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra!");
    }
    setRemoving(null);
  };

  // ================= SEARCH =================
  const filtered = playlists.filter((playlist) =>
    (playlist.folderName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // ================= LOADING =================
  if (loading) {
    return <p className="text-gray-400 text-sm">Đang tải...</p>;
  }

  // ================= CHƯA LOGIN =================
  if (!uid) {
    return <p className="text-gray-400 text-sm">Vui lòng đăng nhập.</p>;
  }

  return (
    <div className="fav-page">
      {/* ================= HEADER ================= */}
      <div className="fav-header">
        <div>
          <h2 className="fav-title">
            <FaLayerGroup size={18} className="fav-title-icon" />
            Danh Sách
          </h2>
          <p className="fav-subtitle">{playlists.length}/5 danh sách</p>
        </div>

        {/* VIEW TOGGLE */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            <FaTh size={13} />
          </button>
          <button
            className={`toggle-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            <FaList size={13} />
          </button>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="fav-controls">
        <div className="fav-search-wrap">
          <FaSearch size={12} className="search-icon" />
          <input
            className="fav-search"
            placeholder="Tìm danh sách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              <FaTimes size={10} />
            </button>
          )}
        </div>

        {playlists.length < 5 && (
          <button
            className="genre-btn active flex items-center gap-2"
            onClick={() => setModal({ type: "add" })}
          >
            <FaPlus size={11} />
            Thêm mới
          </button>
        )}
      </div>

      {/* ================= EMPTY ================= */}
      {playlists.length === 0 && (
        <div className="fav-empty">
          <div className="empty-icon">
            <FaLayerGroup size={28} color="rgba(245,197,24,0.2)" />
          </div>
          <p className="empty-text">Chưa có danh sách nào</p>
          <p className="empty-sub">Nhấn + Thêm mới để tạo danh sách phim</p>
        </div>
      )}

      {/* ================= GRID VIEW ================= */}
      {view === "grid" && filtered.length > 0 && (
        <div className="fav-grid">
          {filtered.map((playlist, idx) => {
            return (
              <div
                key={playlist.id}
                className={`fav-grid-card ${removing === playlist.id ? "removing" : ""}`}
                style={{ animationDelay: `${idx * 0.05}s`, cursor: "pointer" }}
                onClick={() => setSelectedPlaylist(playlist)}
                
              >
                {/* POSTER */}
                <div
                  className="grid-poster"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a2f45 0%, #0d1e2e 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="poster-overlay" />

                  {/* COUNT */}
                  <div className="grid-rating">
                    <FaPlay size={10} color="#f5c518" />
                    <span>{playlist.count ?? 0} phim</span>
                  </div>

                  {/* EDIT — ngăn bubble lên card */}
                  <button
                    className="grid-btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ type: "edit", index: idx });
                    }}
                  >
                    ✎
                  </button>
                </div>

                {/* INFO */}
                <div className="grid-info">
                  <p className="grid-title">{playlist.folderName}</p>
                  <p className="grid-meta">{playlist.count ?? 0} phim</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= LIST VIEW ================= */}
      {view === "list" && filtered.length > 0 && (
        <div className="fav-list">
          {filtered.map((playlist, idx) => {
            const firstMovieId = (playlist.movies ?? [])[0];
            const firstMovie = firstMovieId
              ? objectById(movies, firstMovieId)
              : null;

            return (
              <div
                key={playlist.id}
                className={`fav-list-card ${removing === playlist.id ? "removing" : ""}`}
                style={{ animationDelay: `${idx * 0.04}s`, cursor: "pointer" }}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                {/* THUMB */}
                <div
                  className="list-thumb"
                  style={{
                    backgroundImage: firstMovie?.imgUrl
                      ? `url(${firstMovie.imgUrl})`
                      : "none",
                    backgroundColor: firstMovie?.color ?? "#0d2137",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!firstMovie && (
                    <FaFilm size={20} color="rgba(255,255,255,0.1)" />
                  )}
                </div>

                {/* INFO */}
                <div className="list-info">
                  <p className="list-title">{playlist.folderName}</p>
                  <p className="list-meta">{playlist.count ?? 0} phim</p>
                </div>

                {/* RATING */}
                <div className="list-rating">
                  <FaStar size={12} color="#f5c518" />
                  <span>{playlist.count ?? 0}</span>
                </div>

                {/* ACTION */}
                <div className="list-actions">
                  <button
                    className="list-btn-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ type: "edit", index: idx });
                    }}
                  >
                    ✎ Sửa
                  </button>
                  <button
                    className="list-btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal({ type: "edit", index: idx });
                    }}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= PLAYLIST MODAL (add/edit) ================= */}
      {modal && (
        <PlaylistModal
          type={modal.type}
          currentName={
            modal.type === "edit" ? playlists[modal.index]?.folderName : ""
          }
          onClose={() => setModal(null)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ================= DIALOG XEM PHIM TRONG PLAYLIST ================= */}
      {selectedPlaylist && (
        <DialogListMovie
          playlist={selectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
          showToast={showToast}
        />
      )}

      {/* ================= TOAST ================= */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-900/80 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2 z-50">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
