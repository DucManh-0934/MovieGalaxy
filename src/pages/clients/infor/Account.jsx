import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCamera,
  FaEdit,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCheck,
  FaTimes,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";
import "./Account.css";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { updateDocument } from "../../../services/firebaseService";
import { uploadImageToCloudinary } from "../../../config/cloundinaryConfig";

const toDateInput = (str) => {
  if (!str) return "";
  const [d, m, y] = str.split("/");
  return `${y}-${m?.padStart(2, "0")}-${d?.padStart(2, "0")}`;
};

const toDateStore = (str) => {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${parseInt(d)}/${parseInt(m)}/${y}`;
};

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function BadgePill({ label }) {
  return <span className="badge-pill">{label}</span>;
}

export default function Account() {
  const { isLogin, handleLogin } = useContext(ContextLogin);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    numberaddress: "",
    birthday: "",
  });
  const [errors, setErrors] = useState({
    phonenumber: "",
    numberaddress: "",
    birthday: "",
  });
  const [saved, setSaved] = useState(false);

  // ── Avatar ──
  const fileInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  // ── Mật khẩu ──
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [pwErrors, setPwErrors] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [pwSaved, setPwSaved] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    if (!isLogin) return;
    setForm({
      name: isLogin.name ?? "",
      email: isLogin.email ?? "",
      phonenumber: isLogin.phonenumber ?? "",
      numberaddress: isLogin.numberaddress ?? "",
      birthday: isLogin.birthday ?? "",
    });
    setAvatarUrl(isLogin.avatar ?? "");
  }, [isLogin]);

  // ── Avatar handlers ──
  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }
    try {
      setAvatarUploading(true);
      const url = await uploadImageToCloudinary(file, "imgUrl");
      setAvatarUrl(url);
      const accUpdate = await updateDocument("account", {
        id: isLogin.id,
        imgUrl: url,
      });
      handleLogin(accUpdate);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Upload avatar thất bại:", err);
      alert("Upload ảnh thất bại, vui lòng thử lại!");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  }

  // ── Form handlers ──
  function handleChange(e) {
    const val =
      e.target.name === "birthday"
        ? toDateStore(e.target.value)
        : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  }

  const validation = () => {
    const newErrors = {};
    if (!form.phonenumber)
      newErrors.phonenumber = "Vui lòng nhập số điện thoại!";
    if (!form.numberaddress) newErrors.numberaddress = "Vui lòng nhập địa chỉ!";
    if (!form.birthday) newErrors.birthday = "Vui lòng nhập ngày sinh!";
    setErrors(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };

  async function handleSave() {
    if (validation()) return;
    try {
      await updateDocument("account", { id: isLogin.id, ...form });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancel() {
    setEditing(false);
    setErrors({ phonenumber: "", numberaddress: "", birthday: "" });
    setForm({
      name: isLogin?.name ?? "",
      email: isLogin?.email ?? "",
      phonenumber: isLogin?.phonenumber ?? "",
      numberaddress: isLogin?.numberaddress ?? "",
      birthday: isLogin?.birthday ?? "",
    });
  }

  // ── Password handlers ──
  const validationPassword = () => {
    const newErrors = {};
    if (!pwForm.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ!";
    } else if (pwForm.oldPassword !== isLogin.password) {
      newErrors.oldPassword = "Mật khẩu cũ không đúng!";
    }
    if (!pwForm.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới!";
    } else if (pwForm.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự!";
    }
    setPwErrors(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };

  async function handleChangePassword() {
    if (validationPassword()) return;
    try {
      await updateDocument("account", {
        id: isLogin.id,
        password: pwForm.newPassword,
      });
      setPwForm({ oldPassword: "", newPassword: "" });
      setPwErrors({ oldPassword: "", newPassword: "" });
      setShowChangePassword(false);
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancelPassword() {
    setShowChangePassword(false);
    setPwForm({ oldPassword: "", newPassword: "" });
    setPwErrors({ oldPassword: "", newPassword: "" });
  }

  if (!isLogin) {
    return <p className="text-gray-400 text-sm p-4">Vui lòng đăng nhập.</p>;
  }

  return (
    <div className="account-page">
      {saved && (
        <div className="toast-success">
          <FaCheck size={13} /> Lưu thành công!
        </div>
      )}
      {pwSaved && (
        <div className="toast-success">
          <FaCheck size={13} /> Đổi mật khẩu thành công!
        </div>
      )}

      {/* ── Hero ── */}
      <div className="account-hero">
        <div className="hero-bg-glow" />

        {/* Input file ẩn */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />

        <div className="avatar-wrap">
          <div className="avatar-ring">
            <div className="avatar-circle">
              {isLogin ? (
                <img src={isLogin.imgUrl} alt="avatar" />
              ) : (
                <FaUser size={36} color="rgba(245,197,24,0.5)" />
              )}
            </div>
          </div>
          <button
            className="avatar-upload-btn"
            title="Đổi ảnh"
            onClick={handleAvatarClick}
            disabled={avatarUploading}
            style={{
              opacity: avatarUploading ? 0.5 : 1,
              cursor: avatarUploading ? "not-allowed" : "pointer",
            }}
          >
            {avatarUploading ? (
              <span style={{ fontSize: 9, fontWeight: 700 }}>...</span>
            ) : (
              <FaCamera size={12} />
            )}
          </button>
        </div>

        <div className="hero-identity">
          <h2 className="hero-name">{form.name}</h2>
          <p className="hero-username">{isLogin.email}</p>
          <div className="hero-badges">
            <BadgePill label="Thành viên" />
          </div>
          <p className="hero-joined">
            <FaShieldAlt size={11} style={{ marginRight: 5 }} />
            ID: {isLogin.id?.slice(0, 10)}...
          </p>
        </div>
        {!editing && (
          <button className="btn-edit-hero" onClick={() => setEditing(true)}>
            <FaEdit size={13} /> Chỉnh sửa
          </button>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <StatCard label="Đã xem" value={0} />
        <StatCard label="Đánh giá" value={0} />
        <StatCard label="Watchlist" value={0} />
        <StatCard label="Theo dõi" value={0} />
      </div>

      {/* ── Info form ── */}
      <div className="account-section">
        <div className="section-header">
          <span className="section-title">Thông tin cá nhân</span>
          {editing && (
            <div className="section-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                <FaTimes size={12} /> Huỷ
              </button>
              <button className="btn-save" onClick={handleSave}>
                <FaCheck size={12} /> Lưu
              </button>
            </div>
          )}
        </div>

        <div className="info-grid">
          <Field
            icon={<FaUser size={14} />}
            label="Họ và tên"
            name="name"
            value={form.name}
            editing={editing}
            onChange={handleChange}
            readOnly
          />

          <Field
            icon={<FaEnvelope size={14} />}
            label="Email"
            name="email"
            value={form.email}
            type="email"
            editing={editing}
            onChange={handleChange}
            readOnly
          />

          <Field
            icon={<FaPhone size={14} />}
            label="Số điện thoại"
            name="phonenumber"
            value={form.phonenumber}
            editing={editing}
            onChange={handleChange}
            error={errors.phonenumber}
          />

          <Field
            icon={<FaMapMarkerAlt size={14} />}
            label="Địa chỉ"
            name="numberaddress"
            value={form.numberaddress}
            editing={editing}
            onChange={handleChange}
            error={errors.numberaddress}
            placeholder="Nhập địa chỉ của bạn..."
          />

          <Field
            icon={<FaBirthdayCake size={14} />}
            label="Ngày sinh"
            name="birthday"
            value={toDateInput(form.birthday)}
            type="date"
            editing={editing}
            onChange={handleChange}
            error={errors.birthday}
          />

          {/* ── Mật khẩu ── */}
          <div className="field-item">
            <label className="field-label">
              <span className="field-icon">
                <FaLock size={14} />
              </span>
              Mật khẩu
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <p
                className="field-value"
                style={{ flex: 1, letterSpacing: "3px" }}
              >
                {showPassword
                  ? isLogin.password
                  : "•".repeat(isLogin.password?.length ?? 8)}
              </p>
              <button
                onClick={() => setShowPassword((v) => !v)}
                style={btnIconStyle}
              >
                {showPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
              </button>
              <button
                onClick={() => setShowChangePassword((v) => !v)}
                style={btnChangePwStyle}
              >
                <FaKey size={10} /> Đổi MK
              </button>
            </div>

            {showChangePassword && (
              <div style={changePwBoxStyle}>
                <PwInput
                  label="Mật khẩu cũ"
                  value={pwForm.oldPassword}
                  show={showOldPw}
                  onToggle={() => setShowOldPw((v) => !v)}
                  onChange={(e) =>
                    setPwForm((f) => ({ ...f, oldPassword: e.target.value }))
                  }
                  placeholder="Nhập mật khẩu cũ..."
                  error={pwErrors.oldPassword}
                />
                <PwInput
                  label="Mật khẩu mới"
                  value={pwForm.newPassword}
                  show={showNewPw}
                  onToggle={() => setShowNewPw((v) => !v)}
                  onChange={(e) =>
                    setPwForm((f) => ({ ...f, newPassword: e.target.value }))
                  }
                  placeholder="Nhập mật khẩu mới..."
                  error={pwErrors.newPassword}
                />
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button className="btn-cancel" onClick={handleCancelPassword}>
                    <FaTimes size={12} /> Huỷ
                  </button>
                  <button className="btn-save" onClick={handleChangePassword}>
                    <FaCheck size={12} /> Xác nhận
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sở thích ── */}
      <div className="account-section">
        <div className="section-header">
          <span className="section-title">Sở thích điện ảnh</span>
        </div>
        <div className="genre-list">
          {[
            "Hành động",
            "Kinh dị",
            "Tâm lý",
            "Tình cảm",
            "Sci-Fi",
            "Hoạt hình",
            "Tài liệu",
          ].map((g, i) => (
            <span
              key={g}
              className={`genre-tag ${i < 4 ? "genre-active" : ""}`}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inline styles ──
const btnIconStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  padding: "4px 8px",
  color: "rgba(255,255,255,0.5)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};
const btnChangePwStyle = {
  background: "rgba(245,197,24,0.1)",
  border: "1px solid rgba(245,197,24,0.25)",
  borderRadius: "6px",
  padding: "4px 10px",
  color: "#f5c518",
  cursor: "pointer",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontWeight: 600,
};
const changePwBoxStyle = {
  marginTop: "12px",
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

// ── PwInput ──
function PwInput({
  label,
  value,
  show,
  onToggle,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div>
      <label
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "4px",
          display: "block",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="field-input"
          style={{ paddingRight: "36px" }}
        />
        <button
          onClick={onToggle}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
          }}
        >
          {show ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

// ── Field ──
function Field({
  icon,
  label,
  name,
  value,
  editing,
  onChange,
  type = "text",
  readOnly = false,
  error = "",
  placeholder = "",
}) {
  return (
    <div className="field-item">
      <label className="field-label">
        <span className="field-icon">{icon}</span>
        {label}
      </label>
      {editing ? (
        <>
          <input
            type={type}
            name={name}
            value={value}
            onChange={readOnly ? undefined : onChange}
            placeholder={placeholder}
            className={`field-input ${readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
            readOnly={readOnly}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </>
      ) : (
        <p className="field-value">{value || placeholder}</p>
      )}
    </div>
  );
}
