import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

function AddPlaylistModal({ onClose, onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-72 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white">
          <FaTimes />
        </button>
        <h3 className="font-semibold text-white mb-4">Thêm danh sách mới</h3>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Tên danh sách"
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white mb-4 outline-none focus:border-yellow-400"
        />
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300">
            <FaPlus size={11} /> Thêm
          </button>
          <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPlaylistModal;