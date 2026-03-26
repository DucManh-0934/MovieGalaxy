import React, { useState } from "react";
import {
  FaArrowAltCircleLeft,
  FaArrowDown,
  FaChessKing,
  FaHandPaper,
  FaUserAlt,
} from "react-icons/fa";
import { IoIosAddCircle, IoMdArrowDropright } from "react-icons/io";
import {
  MdCellWifi,
  MdDashboard,
  MdOutlinePictureInPicture,
} from "react-icons/md";
import { LISTMENU } from "../../untils/Contants";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { Link } from "react-router-dom";

function MenuAdmin(props) {
  const [show, setShow] = useState(null);
  const [menuShow, setMenuShow] = useState(false);
  return (
    <div
      className={`menu_admin transition-all duration-500 ease-in-out p-5 md:h-screen font-serif ${menuShow ? "md:w-60" : "md:w-25"}`}
    >
      <div className="flex items-center gap-3 text-2xl justify-center">
        {menuShow && (
          <div className="flex not-italic">
            <div className="text-white">Galaxy</div>
            <div className="text-amber-300">Admin</div>
          </div>
        )}
        <div onClick={() => setMenuShow(!menuShow)}>
          {menuShow ? (
            <FaArrowAltCircleLeft className="text-white" />
          ) : (
            <AiOutlineMenuUnfold className="text-white" />
          )}
        </div>
      </div>
      <div className={menuShow ? "" :"max-md:hidden"} >
        <div className="bg-white cursor-pointer hover:bg-gray-500 hover:text-yellow-500 mt-3 rounded-lg">
          <button className="py-2 px-1 flex items-center gap-3 ">
            <MdDashboard /> {menuShow && <p>Dash board</p>}
          </button>
        </div>
        <div className="mt-3" >
          {menuShow && <div className="text-white">Form and Data</div>}
          {LISTMENU.map((e, i) => (
            <div className="relative">
              <div
                onClick={() => setShow(show == i ? null : i)}
                className="bg-white cursor-pointer gap-2 hover:bg-gray-500 hover:text-white mt-3 rounded-lg flex items-center p-2"
              >
                {e.icon} {menuShow && <p className="text-nowrap">{e.title}</p>}
                <IoMdArrowDropright className="ml-auto" />
              </div>
              {show == i && (
                <div
                  className={`flex flex-col ${!menuShow ? "absolute -right-1 top-0  translate-x-full" : ""}`}
                >
                  {e.subMenu.map((p, index) => (
                    <Link
                      to={p.path}
                      className="bg-white mt-2 p-2 cursor-pointer hover:bg-gray-500 hover:text-white  rounded-lg"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {menuShow && <div className="text-white mt-3">Pages</div>}
          <div className="bg-white cursor-pointer hover:bg-gray-500 hover:text-white mt-3 rounded-lg">
            <button className="py-2 px-3 flex items-center gap-3 ">
              <FaUserAlt /> {menuShow && <p>User Pages</p>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuAdmin;
