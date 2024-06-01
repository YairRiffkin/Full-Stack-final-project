
const openModal = () => setModalOpen(true);
const closeModal = () => setModalOpen(false);

export const Modal = ({ onClose, text }) => (
    <div className="modal">
      <p>{text}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );