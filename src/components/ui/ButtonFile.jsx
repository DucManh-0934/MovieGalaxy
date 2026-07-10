import styled from '@emotion/styled';
import React from 'react';
import { FaFileUpload } from 'react-icons/fa';
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function ButtonFile({handleBannerImageChange , object , title , styleImg}) {

    return (
          <div className={`${styleImg} relative w-30 h-50 group rounded-xl overflow-hidden shadow-md`}>
                <img
                  src={object[title]}
                  alt="Banner"
                  className="w-full h-full object-cover transition duration-300 group-hover:brightness-50"
                />
                {!object[title] && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500">
                    <FaFileUpload className="text-2xl mb-1" />
                    <span className="text-sm">Chưa có {title}</span>
                  </div>
                )}

                <label            
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2
                 opacity-0 group-hover:opacity-100 transition duration-300
                 bg-black/40 cursor-pointer"
                >
                  <div
                    className="flex items-center gap-2 bg-white/90 text-gray-800 px-4 py-2 rounded-full
                       shadow hover:bg-white transition"
                  >
                    <FaFileUpload className="text-lg" />
                    <span className="text-sm font-medium">Upload {title}</span>
                  </div>
                  <VisuallyHiddenInput
              
                    type="file"
                    multiple
                    onChange={handleBannerImageChange}
                  />
                </label>
              </div>
    );
}

export default ButtonFile;