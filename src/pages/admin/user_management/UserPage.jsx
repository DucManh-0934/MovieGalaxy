import React, { useContext, useMemo, useState } from "react";
import { ContextAuth } from "../../../contexts/AuthProvide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { updateDocument } from "../../../services/firebaseService";
import "./UserPage.css";

// ─── Thiết kế: "vé xem phim" (ticket-stub) ───────────────────────────────
// Palette: than chì gần đen + vàng đồng (gold) như huy hiệu rạp chiếu +
// đỏ rượu vang cho vai trò admin. Mỗi tài khoản là một "vé", có mép răng
// cưa bên trái (perforation) và một "cuống vé" chứa role, giống vé xem
// phim thật bị xé đôi.

// ─── Bảng vai trò & quyền hạn ─────────────────────────────────────────────
// admin : toàn quyền, được phép phân quyền cho người khác.
// staff : được vào trang quản trị (admin) nhưng KHÔNG có quyền như admin
//         (không thấy/thao tác được nút phân quyền).
// user  : chỉ vào trang người dùng thông thường, không vào được /admin.
export const ROLES = [
  { value: "admin", label: "Quản trị viên" },
  { value: "staff", label: "Nhân viên" },
  { value: "user", label: "Khách hàng" },
];

// Dùng trong route guard (vd PrivateRoute cho /admin/*):
//   const { isLogin } = useContext(ContextLogin);
//   if (!canAccessAdmin(isLogin?.role)) return <Navigate to="/" />;
export function canAccessAdmin(role) {
  return role === "admin" || role === "staff";
}

// Chỉ admin mới được thấy/thao tác nút phân quyền
export function canManageRoles(role) {
  return role === "admin";
}

// Dùng để redirect sau khi đăng nhập thành công (trong handleLogin/LoginPage)
export function getHomeRouteForRole(role) {
  if (role === "admin" || role === "staff") return "/admin";
  return "/";
}

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString("vi-VN");
}

function RoleTag({ role }) {
  const cls = role === "admin" ? "admin" : role === "staff" ? "staff" : "user";
  const label = ROLES.find((r) => r.value === role)?.label || "Khách hàng";
  return <span className={`tag ${cls}`}>{label}</span>;
}

// Chọn vai trò — chỉ hiện khi người xem là admin
function RoleSelect({ acc, onChangeRole, disabled, saving }) {
  return (
    <select
      className="role-select"
      value={acc.role || "user"}
      disabled={disabled || saving}
      onChange={(e) => onChangeRole(acc.id, e.target.value)}
      title={disabled ? "Không thể tự đổi vai trò của chính mình" : "Phân quyền"}
    >
      {ROLES.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
}

function AccountTicket({ acc, isAdminViewer, currentUserId, onChangeRole, savingId }) {
  const [showPass, setShowPass] = useState(false);
  const isSelf = acc.id && acc.id === currentUserId;
  const saving = savingId === acc.id;

  return (
    <div className="ticket">
      <div className="ticket-perf" aria-hidden="true" />

      <div className="ticket-main">
        <div className="ticket-head">
          <div className="avatar">
            {acc.imgUrl ? (
              <img src={acc.imgUrl} alt={acc.name} />
            ) : (
              <span>{initials(acc.name)}</span>
            )}
          </div>
          <div className="ticket-title">
            <h3>{acc.name || "Chưa đặt tên"}</h3>
            <p className="mono">{acc.email}</p>
          </div>

          {/* Chỉ admin mới thấy nút phân quyền; nhân viên & khách hàng chỉ thấy nhãn tĩnh */}
          {isAdminViewer ? (
            <RoleSelect
              acc={acc}
              onChangeRole={onChangeRole}
              disabled={isSelf}
              saving={saving}
            />
          ) : (
            <RoleTag role={acc.role} />
          )}
        </div>

        <div className="ticket-divider">
          <span className="dot" />
          <span className="line" />
          <span className="dot" />
        </div>

        <dl className="ticket-grid">
          <div>
            <dt>Điện thoại</dt>
            <dd className="mono">{acc.phonenumber || "—"}</dd>
          </div>
          <div>
            <dt>Ngày sinh</dt>
            <dd className="mono">{formatDate(acc.birthday)}</dd>
          </div>
          <div className="span-2">
            <dt>Địa chỉ</dt>
            <dd>{acc.numberaddress || "Chưa cập nhật"}</dd>
          </div>
          <div className="span-2">
            <dt>Mật khẩu</dt>
            <dd className="mono pass-row">
              <span>
                {showPass
                  ? acc.password || "—"
                  : "•".repeat(Math.max(6, (acc.password || "").length))}
              </span>
              <button type="button" onClick={() => setShowPass((s) => !s)}>
                {showPass ? "Ẩn" : "Hiện"}
              </button>
            </dd>
          </div>
        </dl>
      </div>

      <div className="ticket-stub">
        <span className="stub-label">VÉ</span>
        <span className="stub-id mono">{(acc.id || "").slice(0, 8) || "—"}</span>
      </div>
    </div>
  );
}

export default function UserPage() {
  // ContextAuth chỉ cung cấp mảng accounts (realtime từ Firestore)
  const accounts = useContext(ContextAuth) || [];
  // ContextLogin cho biết ai đang đăng nhập
  const { isLogin } = useContext(ContextLogin) || {};

  const isAdminViewer = canManageRoles(isLogin?.role);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return (accounts || []).filter((a) => {
      const matchQuery =
        !query ||
        a.name?.toLowerCase().includes(query.toLowerCase()) ||
        a.email?.toLowerCase().includes(query.toLowerCase());
      const matchRole = roleFilter === "all" || a.role === roleFilter;
      return matchQuery && matchRole;
    });
  }, [accounts, query, roleFilter]);

  async function handleChangeRole(id, newRole) {
    setError("");
    setSavingId(id);
    try {
      // accounts sẽ tự cập nhật UI qua onSnapshot (realtime) trong ContextAuth,
      // nên không cần setState thủ công ở đây.
      await updateDocument("accounts", { id, role: newRole });
    } catch (err) {
      console.error("Cập nhật vai trò thất bại:", err);
      setError("Cập nhật vai trò thất bại, vui lòng thử lại.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="userpage">
      <div className="userpage-head">
        <div>
          <span className="eyebrow">Quản lý người dùng</span>
          <h1>Danh sách tài khoản</h1>
          <span className="count">
            {filtered.length} / {accounts?.length || 0} tài khoản
          </span>
        </div>
        <div className="controls">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">Tất cả vai trò</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {filtered.length === 0 ? (
        <div className="empty">Không tìm thấy tài khoản nào phù hợp.</div>
      ) : (
        <div className="ticket-list">
          {filtered.map((acc) => (
            <AccountTicket
              key={acc.id || acc.email}
              acc={acc}
              isAdminViewer={isAdminViewer}
              currentUserId={isLogin?.id}
              onChangeRole={handleChangeRole}
              savingId={savingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}