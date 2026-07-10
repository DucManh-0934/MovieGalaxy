import React, { useState, useContext, useMemo } from "react";
import { FaHeart, FaReply, FaPaperPlane } from "react-icons/fa";
import { ContextComment } from "../../../contexts/CommentProvide";
import "./MovieComment.css";
import { ContextAuth } from "../../../contexts/AuthProvide";

function timeAgo(isoString) {
  if (!isoString) return "Vừa xong";
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export default function MovieComment({ movieId, currentAccount }) {
  const { comments, addComment, toggleLike } = useContext(ContextComment);

  const [text, setText] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [focused, setFocused] = useState(false);
  const accounts = useContext(ContextAuth);

  const movieComments = useMemo(() => {
    return comments
      .filter((c) => c.movieId === movieId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [comments, movieId]);

  const handleSubmit = async () => {
    if (!text.trim() || !currentAccount) return;
    await addComment(movieId, text.trim(), isSpoiler, currentAccount);
    setText("");
    setIsSpoiler(false);
    setFocused(false);
  };

  return (
    <div className="mc-wrap">
      <div className="mc-header">
        <div className="mc-header-line" />
        <span className="mc-header-title">Bình luận</span>
        <span className="mc-header-count">
          {movieComments.length} bình luận
        </span>
      </div>

      {/* Input */}
      <div className="mc-input-row">
        <img
          className="mc-avatar-img"
          src={currentAccount?.imgUrl || currentAccount?.imgUrl}
          alt="avatar"
        />
        <div className="mc-input-box">
          <textarea
            className="mc-textarea"
            rows={focused ? 3 : 2}
            placeholder={
              currentAccount ? "Viết bình luận..." : "Đăng nhập để bình luận"
            }
            disabled={!currentAccount}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
          />
          {focused && currentAccount && (
            <div className="mc-actions">
              <label className="mc-spoiler-check">
                <input
                  type="checkbox"
                  checked={isSpoiler}
                  onChange={(e) => setIsSpoiler(e.target.checked)}
                />
                Chứa spoiler
              </label>
              <button
                className="mc-btn-cancel"
                onClick={() => {
                  setText("");
                  setFocused(false);
                }}
              >
                Hủy
              </button>
              <button className="mc-btn-send" onClick={handleSubmit}>
                <FaPaperPlane size={11} /> Gửi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="mc-list">
        {movieComments.length === 0 && (
          <p className="mc-empty">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}
        {movieComments.map((c) => {
          const author = accounts?.find((a) => a.id === c.accountID);
          const isLiked = c.likedBy?.includes(currentAccount?.email);
          return (
            <div key={c.id} className="mc-comment">
              <img
                className="mc-avatar-img"
                src={
                  author?.imgUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRywwvNmilhncyvLuJtQuOdLbTGdMK1JSTVpA&s"
                }
                alt={author?.username}
              />
              <div className="mc-comment-body">
                <div className="mc-comment-top">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span className="mc-name">{author?.username}</span>
                    {c.spoiler && (
                      <span className="mc-spoiler-badge">Spoiler</span>
                    )}
                  </div>
                  <span className="mc-time">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mc-text">{c.content}</p>
                <div className="mc-comment-footer">
                  <button className="mc-reply-btn">
                    <FaReply size={11} /> Trả lời
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
