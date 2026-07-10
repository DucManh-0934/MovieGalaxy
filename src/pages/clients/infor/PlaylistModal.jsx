import React, { useState } from 'react';
import { FaPlus, FaCheck, FaTrash, FaTimes } from 'react-icons/fa';

function PlaylistModal({ type, currentName, onClose, onAdd, onEdit, onDelete }) {
  const [name, setName] = useState(currentName);
  const isAdd = type === 'add';

  const handleSubmit = () => {
    if (!name.trim()) return;
    isAdd ? onAdd(name.trim()) : onEdit(name.trim());
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-72 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white">
          <FaTimes />
        </button>
        <h3 className="font-semibold text-white mb-4">
          {isAdd ? 'Thêm danh sách mới' : 'Sửa danh sách'}
        </h3>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Tên danh sách"
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white mb-4 outline-none focus:border-yellow-400"
        />
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300">
            {isAdd ? <><FaPlus size={11} /> Thêm</> : <><FaCheck size={11} /> Lưu</>}
          </button>
          {isAdd ? (
            <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600">
              Đóng
            </button>
          ) : (
            <button onClick={handleDelete} className="flex items-center gap-2 bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-sm hover:bg-red-900">
              <FaTrash size={11} /> Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaylistModal;