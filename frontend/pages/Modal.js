// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, holderPercentages }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Holder Percentages</h2>
        <ul>
          {holderPercentages.map((holder, index) => (
            <li key={index} className="mb-2">
              {holder.holder.slice(0, 5)}...{holder.holder.slice(-5)}: {holder.percentage.toFixed(2)}%
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
