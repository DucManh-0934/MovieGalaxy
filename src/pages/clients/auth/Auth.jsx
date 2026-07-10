import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { motion, AnimatePresence } from "framer-motion";
import Register from "./Register";
import Login from "./Login";
import { addDocument } from "../../../services/firebaseService";
import { ContextActor } from "../../../contexts/ActorProvide";
import { ContextAuth } from "../../../contexts/AuthProvide";
import { useContext } from "react";
import { ROLES } from "../../../untils/Contants";
const inner = {
  email: "",
  password: "",
  name: "",
};
export default function Auth({ openLogin, handleClose }) {
  const auth = useContext(ContextAuth);
  const [isLogin, setIsLogin] = React.useState(true);
  const toggleAuth = () => setIsLogin(!isLogin);
  const [login, setLogin] = React.useState(inner);
  const [error, setError] = React.useState(inner);
  const onchangeInput = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const validation = () => {
    const newErrors = {};
    newErrors.name = login.name ? "" : "Please Enter Your Name!";
    newErrors.email = login.email ? "" : "Please Enter Your Email!";
    const check = auth.find((e) => e.email === login.email);
    newErrors.email = check ? "The email already exists." : "";
    newErrors.password = login.password ? "" : "Please Enter Your password!";
    setError(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  };
  const handleCloseAuth = () => {
    setLogin(inner);
    setIsLogin(true);
    setError(inner);
    handleClose();
  };
  const addRegister = async () => {
    if (validation()) {
      return;
    }
    await addDocument("accounts", {
      ...login, // gộp name, email, password từ state
      phonenumber: "123456789",
      numberaddress: "",
      birthday: "1/1/2026",
      imgUrl: "",
      role: ROLES.USER
    });
  };

  return (
    <Dialog
      open={openLogin}
      onClose={handleCloseAuth}
      fullWidth
      maxWidth="md"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "32px",
          backgroundColor: "#020617",
          backgroundImage: "none",
          overflow: "hidden",
          // CĂN GIỮA NỘI DUNG TUYỆT ĐỐI THEO CHIỀU DỌC
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Thêm cái này để đẩy nội dung lên giữa
          alignItems: "center",
          minHeight: "550px", // Đảm bảo chiều cao tối thiểu
          position: "relative",
        },
      }}
    >
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ x: -20, opacity: 0 }} // Giảm khoảng cách trượt cho mượt
            animate={{ x: 0, opacity: 1 }} // Vào giữa
            exit={{ x: 20, opacity: 0 }} // Biến mất
            transition={{ duration: 0.3, ease: "easeOut" }}
            // SỬA Ở ĐÂY: Thêm flex-1 và h-full
            className="w-full h-full flex-1 flex items-center justify-center"
          >
            <Login
              onSwitch={toggleAuth}
              login={login}
              handleCloseAuth={handleCloseAuth}
              onchangeInput={onchangeInput}
            />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ x: 20, opacity: 0 }} // Từ bên phải
            animate={{ x: 0, opacity: 1 }} // Vào giữa
            exit={{ x: -20, opacity: 0 }} // Biến mất
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full flex-1 flex items-center justify-center"
          >
            <Register
              onSwitch={toggleAuth}
              login={login}
              onchangeInput={onchangeInput}
              addRegister={addRegister}
              handleCloseAuth={handleCloseAuth}
              error={error}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
