import React, { useContext, useState } from "react";
import { CiBellOn, CiSettings } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { RiFindReplaceLine } from "react-icons/ri";
import { ContextLogin } from "../../contexts/LoginProvide";

function HeaderAdmin(props) {
  const [show, setShow] = useState(false);
    const { isLogin, handleLogout } = useContext(ContextLogin);
  
  return (
    <div className="font-serif p-3  flex justify-between items-center">
      <div className="p-3  text-white">
        <div className="text-2xl">
          Good Morning, Users <br />
        </div>
        <div className="text-x">Your performance summary this week</div>
      </div>
      <div className="flex text-2xl text-white gap-3 items-center">
        <div className="hover:scale-125">
          <RiFindReplaceLine />
        </div>
        <div className="hover:scale-110">
          <MdEmail />
        </div>
        <div className="hover:scale-110">
          <CiBellOn />
        </div>
        <div className="relative" onClick={()=>setShow(!show)}>
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.cmfeZt4mhxT3HUiogsfrywHaFj?pid=Api&h=220&P=0"
            alt=""
            className="w-10 h-10 cursor-pointer  rounded-full"
          />
          {show && (
            <div className="absolute p-2 rounded-xl text-lg right-0 -bottom-1 translate-y-full  bg-white text-black">
              <div className="flex items-center gap-2">
                <FaRegUser /> Profile
              </div>
              <div className="flex items-center gap-2">
                <CiSettings /> Setting
              </div>
              <div className="flex items-center gap-2 text-nowrap" onClick={handleLogout}>
                <IoIosLogOut /> Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
