import React, { useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initialOptions } from "../../../untils/Contants";
import { addDocument } from "../../../services/firebaseService";
import { ContextLogin } from "../../../contexts/LoginProvide";
import "./CheckOutMovie.css";

const PAYMENT_METHODS = [
  { id: "credit", icon: "💳", label: "Thẻ tín dụng" },
  { id: "atm",    icon: "🏦", label: "Thẻ ATM" },
  { id: "momo",   icon: "👛", label: "Ví MoMo" },
  { id: "zalopay",icon: "👛", label: "Ví ZaloPay" },
  { id: "shopeepay", icon: "👛", label: "Ví ShopeePay" },
  { id: "vnpay",  icon: "📱", label: "VNPAY" },
];

// Tỉ giá quy đổi VNĐ -> USD cho PayPal (chỉnh lại nếu bạn có API tỉ giá riêng)
const USD_RATE = 25000;

// Số ngày thuê phim lẻ (khớp với mô tả "Thời hạn 3 ngày" ở trang RentMovieBuy)
// Chỉnh lại nếu logic thực tế khác (ví dụ 30 ngày như ghi chú trong UI)
const RENT_DURATION_DAYS = 3;

function CheckOutMovie() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isLogin } = useContext(ContextLogin);
  const { movieId, movieName, plan, price } = state || {};
  const [selectedPM, setSelectedPM] = useState("credit");
  const [coupon, setCoupon] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Thay vì navigate sang trang khác, chỉ cần bật cờ này để hiện overlay "Mua thành công"
  const [isSuccess, setIsSuccess] = useState(false);

  const planLabel = plan === "sieu-viet"
    ? "Siêu Việt — 200.000đ"
    : plan === "galaxy-vip"
    ? "Galaxy VIP — 300.000đ"
    : "Thuê lẻ — 20.000đ";

  // price đến từ RentMovieBuy dạng string đã format, vd "20.000đ" -> lấy về số nguyên VNĐ
  const priceNumber = useRef(0);
  priceNumber.current = Number(String(price || "0").replace(/[^\d]/g, "")) || 0;

  // Tạo document RentHistory với đầy đủ field theo schema Firestore
  const createRentOrder = async (transactionId, paymentMethod) => {
    const starDate = new Date();
    const expiryDate = new Date(
      starDate.getTime() + RENT_DURATION_DAYS * 24 * 60 * 60 * 1000
    );

    const newOrder = {
      accountID: isLogin?.id || null,
      movieID: movieId || null,
      movieName: movieName || null,
      paymentMethod: paymentMethod,
      plan: plan || "phim-le",
      price: priceNumber.current,
      transactionID: transactionId,
      starDate: starDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      createdAt: starDate.toISOString(),
    };
    await addDocument("RentHistory", newOrder);
  };

  // Xử lý các phương thức thanh toán nội địa (thẻ, MoMo, ZaloPay, VNPAY...)
  // TODO: nếu có cổng thanh toán thật (VNPAY/MoMo API...), thay đoạn giả lập
  // transactionId dưới đây bằng transactionId trả về từ cổng thanh toán.
  const handleConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const transactionId = `${selectedPM.toUpperCase()}-${Date.now()}`;
      await createRentOrder(transactionId, selectedPM);
      setIsSuccess(true);
    } catch (err) {
      console.error("Lỗi khi lưu đơn thuê:", err);
      alert("Thanh toán thất bại, vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Đã mua thành công: hiện overlay xác nhận ngay tại trang, không chuyển trang ──
  if (isSuccess) {
    return (
      <div className="co-page mx-auto">
        <div className="co-success">
          <div className="co-success__icon">✅</div>
          <h1 className="co-success__title">Mua thành công!</h1>
          <p className="co-success__text">
            Bạn đã thuê thành công <strong>{movieName}</strong>.
          </p>

          <div className="co-success__actions">
            <button
              className="btn-confirm"
              onClick={() => navigate(`/table-watch/${movieId}`)}
            >
              Xem ngay
            </button>
            <button
              className="co-success__secondary"
              onClick={() => navigate("/auinformation/filmrent")}
            >
              Xem trong kho phim thuê
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page mx-auto">
      {/* ── LEFT: THÔNG TIN ── */}
      <div className="co-card">
        <p className="co-card-title">Thông tin thanh toán</p>

        <div className="movie-thumb">
          <div className="movie-thumb-placeholder">🎬</div>
          <div className="movie-thumb-info">
            <strong>{movieName || "Tên phim"}</strong>
            <span>Phim lẻ</span>
            <span className="plan-label">{planLabel}</span>
          </div>
        </div>

        <div className="info-row"><span className="lbl">Tài khoản</span><span className="val">0378 486 992</span></div>
        <div className="info-row"><span className="lbl">Phim</span><span className="val">{movieName}</span></div>
        <div className="info-row"><span className="lbl">Độ phân giải</span><span className="val">HD</span></div>
        <div className="info-row"><span className="lbl">Thời hạn</span><span className="val accent">120 phút</span></div>
        <div className="info-row"><span className="lbl">Đơn giá</span><span className="val accent">{price}</span></div>
        <div className="info-row"><span className="lbl">Khuyến mãi</span><span className="val accent">0đ</span></div>
        <div className="total-row">
          <span className="lbl">Tổng cộng</span>
          <span className="val">{price}</span>
        </div>

        <p className="note">
          * Lưu ý: Thời gian thuê phim là 30 ngày sau khi thuê và còn 48 giờ khi bắt đầu xem phim.
        </p>

        <div className="coupon-row">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Nhập mã ưu đãi..."
          />
          <button onClick={() => alert("Mã không hợp lệ")}>Áp dụng ưu đãi</button>
        </div>
      </div>

      {/* ── RIGHT: THANH TOÁN ── */}
      <div className="co-card">
        <p className="pm-title">Chọn phương thức thanh toán</p>

        <div className="pm-grid">
          {PAYMENT_METHODS.map((pm) => (
            <div
              key={pm.id}
              className={`pm-btn ${selectedPM === pm.id ? "active" : ""}`}
              onClick={() => setSelectedPM(pm.id)}
            >
              {pm.icon} {pm.label}
            </div>
          ))}
        </div>

        <button
          className="btn-confirm"
          onClick={handleConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </button>

        <div className="pm-divider">
          <span>hoặc thanh toán bằng</span>
        </div>

        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              const moneyUSD = (priceNumber.current / USD_RATE).toFixed(2);
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: moneyUSD,
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                const transactionId = details.id;
                createRentOrder(transactionId, "paypal").then(() => {
                  setIsSuccess(true);
                });
              });
            }}
            onError={(err) => {
              console.error("PayPal error:", err);
              alert("Thanh toán PayPal thất bại, vui lòng thử lại.");
            }}
          />
        </PayPalScriptProvider>

        <p className="pm-credit-note">Được hỗ trợ bởi PayPal</p>
      </div>
    </div>
  );
}

export default CheckOutMovie;