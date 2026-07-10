import React, { useContext, useState } from "react";
import { ContextAuth } from "../../../contexts/AuthProvide";
import { ContextLogin } from "../../../contexts/LoginProvide";
import { useNotification } from "../../../contexts/NotificationProvide";
import { auth, googleProvider } from "../../../config/firebaseConfig";
import { ROLES } from "../../../untils/Contants";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { addDocument } from "../../../services/firebaseService";
const innerLogin = { email: "", password: "" };
function Login({ onSwitch, onchangeInput, login, handleCloseAuth }) {
  const [isLogin, setIsLogin] = useState(innerLogin);
  const [error, setError] = React.useState(innerLogin);
  const accounts = useContext(ContextAuth);
  const { handleLogin } = useContext(ContextLogin);
  const showNotification = useNotification();
  const loginInput = (e) => {
    setIsLogin({ ...isLogin, [e.target.name]: e.target.value });
  };
  const validation = () => {
    const newErrors = {};

    // check rỗng
    if (!isLogin.email) {
      newErrors.email = "Please Enter Your Email Account";
    }

    if (!isLogin.password) {
      newErrors.password = "Please Enter Your password!";
    }
      const user = accounts.find(
        (e) => e.email === isLogin.email && e.password === isLogin.password,
      );

      if (!user) {
        newErrors.password = "Tài khoản hoặc mật khẩu không đúng";
      } else {
        handleLogin(user);
      }

    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };
  // Google sign-in
  const signInWithGoogle = async () => {

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const existingCustomer = accounts.find(
        (customer) => customer.email == user.email,
      );
      let loggedInCustomer;
      console.log("vtt");
      if (!existingCustomer) {
        const newCustomer = {
          username: user.displayName,
          imgUrl: user.photoURL,
          role: ROLES.USER,
          email: user.email
        };
        const acc = await addDocument("accounts", newCustomer);
        loggedInCustomer = acc;
      } else {
        loggedInCustomer = existingCustomer;
      }
      handleLogin(loggedInCustomer);
      handleCloseAuth();
    } catch (error) {
      alert("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };
  const addLogin = async () => {
    if (validation()) {
      return;
    }
    handleCloseAuth();
    showNotification("Login is successfully!", "success");
  };
  return (
    <div className="w-full flex flex-col lg:flex-row bg-[#020617] items-center self-center">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-12 py-8 overflow-hidden bg-[#020617]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-orange-600 mb-6 rounded-full" />
          <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter mb-6 italic">
            GALAXY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600">
              CINEMA
            </span>
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-xs leading-relaxed border-l border-gray-800 pl-4">
            Đẳng cấp giải trí{" "}
            <span className="text-white">4K chuẩn Hollywood</span>.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 bg-[#020617]">
        <div className="w-full max-w-[360px]">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Đăng nhập
              </h3>
              <div className="h-1 w-6 bg-yellow-500 mt-1 rounded-full" />
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="group">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-yellow-400 transition-colors">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:border-yellow-400/50 outline-none transition-all"
                  name="email"
                  value={isLogin.email}
                  onChange={loginInput}
                />
                {error.email && (
                  <p className="text-red-500 text-sm">{error.email}</p>
                )}
              </div>

              <div className="group">
                <div className="flex justify-between mb-1.5 ml-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest group-focus-within:text-yellow-400 transition-colors">
                    Mật khẩu
                  </label>
                  <button className="text-[10px] text-yellow-500 font-black uppercase">
                    Quên?
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:border-yellow-400/50 outline-none transition-all"
                  name="password"
                  value={isLogin.password}
                  onChange={loginInput}
                />
                {error.password && (
                  <p className="text-red-500 text-sm">{error.password}</p>
                )}
              </div>

              <button
                onClick={addLogin}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-[#020617] font-black py-3.5 rounded-xl shadow-lg shadow-yellow-400/10 active:scale-95 transition-all uppercase text-sm tracking-wide"
              >
                Vào xem phim ngay
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative flex justify-center text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600 bg-transparent">
                <span className="px-3 bg-[#0d1324] rounded-full">Hoặc</span>
              </span>
            </div>

            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all font-bold text-xs"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="w-4 h-4"
                alt=""
              />
              Google Cinema
            </button>

            <p className="text-center text-gray-500 text-[10px] mt-8">
              Chưa có vé?{" "}
              <button
                className="text-yellow-500 font-black hover:underline"
                onClick={onSwitch}
              >
                Đăng ký ngay
              </button>
            </p>
          </div>

          <p className="text-center text-white/10 text-[9px] mt-6 font-black uppercase tracking-[0.4em]">
            Premium Member Only
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
