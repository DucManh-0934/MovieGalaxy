// BuyFeaPack.jsx
import React, { useContext, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ContextPlan } from "../../../contexts/PlanProvide";
import { ContextFeatures } from "../../../contexts/FeaturesProvide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { FaArrowLeft, FaCheck, FaQrcode } from "react-icons/fa6";
import { objectById } from "../../../services/reponsitory";
import "./BuyFeaPack.css";
import { ContextPackage } from "../../../contexts/PackageProvide";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initialOptions } from "../../../untils/Contants";
import { addDoc } from "firebase/firestore";
import { addDocument } from "../../../services/firebaseService";

const PAYMENT_METHODS = [
  { id: "momo", name: "Ví MoMo", icon: "💗" },
  { id: "zalopay", name: "ZaloPay", icon: "💙" },
  { id: "banking", name: "Chuyển khoản ngân hàng", icon: "🏦" },
  { id: "card", name: "Thẻ Visa / Mastercard", icon: "💳" },
];
const inner = {accountID:"",paymentMethod:"paypal",planID:"",price:"",startDate:"",endDate:"",transactionID:""}
function BuyFeaPack() {
  const { id } = useParams();
  const packages = useContext(ContextPackage);
  const navigate = useNavigate();

  const [payment,setPayment]=useState(inner);
  const Plan = useContext(ContextPlan);
  const Features = useContext(ContextFeatures);
  const { isLogin } = useContext(ContextLogin);
  const [selectedPeriod, setSeclectedPeriod] = useState(packages?.[0] || {});
  const [method, setMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const totalPrice = useRef (0);

  // ✅ id từ Firestore là string, không ép Number
  const selectedPlan = useMemo(() => objectById(Plan || [], id), [Plan, id]);

  const planFeatures = useMemo(
    () => Features?.filter((f) => f.PlanId === selectedPlan?.id) || [],
    [Features, selectedPlan],
  );
  const pa = [...packages].sort((a, b) => Number(a.months) - Number(b.months));

  const paymentInfo = useMemo(() => {
    const price = Number(selectedPlan?.price || 0);

    const months = Number(selectedPeriod?.months || 1);

    const discount = Number(selectedPeriod?.discount || 0);

    const totalOriginal = price * months;

    const totalFinal = Math.round(totalOriginal * (1 - discount / 100));
    totalPrice.current = totalFinal;
    return {
      price,
      months,
      discount,
      totalOriginal,
      totalFinal,
    };
  }, [selectedPlan, selectedPeriod]);
  const formattedPrice = paymentInfo.price.toLocaleString("vi-VN");

  const formattedOriginal = paymentInfo.totalOriginal.toLocaleString("vi-VN");
  const formattedFinal = paymentInfo.totalFinal.toLocaleString("vi-VN");
  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/payment-success", {
        state: { plan: selectedPlan, method },
      });
    }, 1200);
  };
  console.log(totalPrice.current);
  const createSubscription = async (idTrans) => {
    const newPayment = {
      accountID:isLogin?.id,
      paymentMethod:"paypal",
      planID:id,
      price:totalPrice.current,
      transactionID:idTrans,
    }
    await addDocument("Subcriptions",newPayment);
  }
  if (!selectedPlan) {
    return (
      <div className="bfp-wrap bfp-empty">
        <p>Không tìm thấy gói bạn chọn.</p>
        <Link to="/" className="bfp-btn-outline">
          Quay về trang chủ
        </Link>
      </div>
    );
  }
  return (
    <div className="bfp-wrap">
      <div className="bfp-bg-glow" />

      {/* Header */}
      <div className="bfp-header">
        <button className="bfp-back" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 className="bfp-title">Xác nhận thanh toán</h1>
        <span className="bfp-spacer" />
      </div>

      <div className="bfp-content">
        {/* LEFT: Payment methods */}
        <div className="bfp-left">
          <h2 className="bfp-section-title">Chọn phương thức thanh toán</h2>

          <div className="bfp-methods">
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.id}
                className={`bfp-method-card ${method === m.id ? "selected" : ""}`}
                onClick={() => setMethod(m.id)}
              >
                <span className="bfp-method-icon">{m.icon}</span>
                <span className="bfp-method-name">{m.name}</span>
                <div className="bfp-radio">
                  {method === m.id && <FaCheck size={11} />}
                </div>
              </div>
            ))}
          </div>

          {method === "banking" && (
            <div className="bfp-bank-info">
              <FaQrcode size={28} className="bfp-bank-icon" />
              <div>
                <p className="bfp-bank-line">
                  Ngân hàng: <b>Vietcombank</b>
                </p>
                <p className="bfp-bank-line">
                  Số tài khoản: <b>0123456789</b>
                </p>
                <p className="bfp-bank-line">
                  Nội dung CK:{" "}
                  <b>
                    VIP {isLogin?.name || "USER"} {selectedPlan.id}
                  </b>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Order summary */}
        <div className="bfp-right">
          <div className="bfp-summary-card">
            <div className="flex space-x-14">
              <div className="">
                <div className="bfp-summary-badge">Gói đã chọn</div>
                <div className="bfp-summary-plan">{selectedPlan.title}</div>
                <div className="bfp-summary-price">
                  {formattedOriginal}đ
                  <span className="bfp-summary-period">
                    /{selectedPeriod?.months}Tháng
                  </span>
                </div>
              </div>
              <div className="bfp-period-select">
                {pa.map((p) => (
                  <label
                    key={p.id}
                    classname={`bfp-period-option ${selectedPeriod.id === p.id ? "active" : " "}`}
                    onClick={() => setSeclectedPeriod(p)}
                  >
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        name="period"
                        checked={selectedPeriod.id === p.id}
                        onChange={() => setSeclectedPeriod(p)}
                      />
                      <div className="bfp-period-info">
                        <span className="bfp-period-label">
                          {p.months} Tháng
                        </span>
                      </div>
                    </div>
                    <span className="bfp-period-discount">
                      Tiết Kiệm {p.discount}%
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bfp-summary-divider" />

            <ul className="bfp-summary-features">
              {planFeatures.map((f) => (
                <li key={f.id}>
                  <span className="bfp-check">✓</span>
                  {f.name}
                </li>
              ))}
            </ul>

            <div className="bfp-summary-divider" />

            <div className="bfp-summary-row">
              <span>Tạm tính</span>
              <span>{formattedOriginal}đ</span>
            </div>
            <div className="bfp-summary-row bfp-summary-total">
              <span>Tổng cộng</span>
              <span>{formattedFinal}đ</span>
            </div>
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  const money = totalPrice.current;
                  console.log(money);
                  
                  const moneyUSD =( money / 25000).toFixed(2);
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
                    const transactionId = details.id; // Lấy ID giao dịch từ PayPal
                    createSubscription(transactionId);
                  });
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                }}
              />
            </PayPalScriptProvider>

            <p className="bfp-terms">
              Bằng việc xác nhận, bạn đồng ý với{" "}
              <span className="bfp-link">Điều khoản dịch vụ</span> của chúng
              tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyFeaPack;
