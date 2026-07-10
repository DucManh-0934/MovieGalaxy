import React from "react";
const inner = [];
function Register({
  onSwitch,
  login,
  onchangeInput,
  addRegister,
  handleCloseAuth,
  error,
}) {
  console.log(error);
  
  return (
    <div className="w-full h-full flex flex-col lg:flex-row-reverse bg-[#020617] items-center justify-center">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center px-10 py-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px]" />

        <div className="relative z-10 text-right flex flex-col items-end">
          <div className="h-1 w-10 bg-gradient-to-l from-yellow-400 to-orange-600 mb-6 rounded-full" />

          <h2 className="text-4xl font-black text-white leading-[0.9] tracking-tighter mb-6 italic uppercase">
            UNLOCK <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600">
              THE POWER
            </span>
          </h2>

          <div className="max-w-[240px] border-r border-white/10 pr-4">
            <p className="text-gray-400 text-xs font-light leading-relaxed italic">
              Đặc quyền tối thượng dành riêng cho tín đồ điện ảnh thực thụ.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[320px]">
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
            <div className="mb-8 text-center lg:text-left">
              <h3 className="text-lg font-bold text-white tracking-widest uppercase">
                Gia nhập Galaxy
              </h3>
              <div className="h-0.5 w-6 bg-yellow-500 mt-1 mx-auto lg:mx-0 rounded-full" />
            </div>

            <div className="space-y-4" >
              <div className="group">
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
                  Danh tính
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:border-yellow-400/50 outline-none transition-all placeholder:text-gray-700"
                  name="name"
                  value={login.name}
                  onChange={onchangeInput}
                />
                {error.name && (
                  <p className="text-red-500 text-sm">{error.name}</p>
                )}
              </div>

              <div className="group">
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:border-yellow-400/50 outline-none transition-all placeholder:text-gray-700"
                  name="email"
                  value={login.email}
                  onChange={onchangeInput}
                />
                {error.email && (
                  <p className="text-red-500 text-sm">{error.email}</p>
                )}
              </div>

              <div className="group">
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
                  Mật mã
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:border-yellow-400/50 outline-none transition-all placeholder:text-gray-700"
                  name="password"
                  value={login.password}
                  onChange={onchangeInput}
                />
                {error.password && (
                  <p className="text-red-500 text-sm">{error.password}</p>
                )}
              </div>

              <button
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-600 text-[#020617] font-black py-3 rounded-xl shadow-lg shadow-yellow-400/5 active:scale-95 transition-all uppercase text-[10px] tracking-[0.15em] mt-4"
                onClick={addRegister}
              >
                Khởi tạo vé
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative flex justify-center text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600 bg-transparent">
                <span className="px-3 bg-[#020617] rounded-full">Hoặc</span>
              </span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 text-gray-400 hover:bg-white/5 transition-all font-bold text-[9px] uppercase tracking-tighter">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="w-3.5 h-3.5"
                alt=""
              />
              Google Connect
            </button>

            <p className="text-center text-gray-600 text-[9px] mt-8 tracking-tight">
              Đã có vé?{" "}
              <button
                className="text-yellow-500 font-black hover:text-yellow-400 transition-colors underline decoration-yellow-500/20 underline-offset-4"
                onClick={onSwitch}
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
