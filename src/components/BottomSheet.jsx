export default function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen && !children) return null

  return (
    <>
      <div
        className={`bottom-sheet-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
      />
      <div className={`bottom-sheet${isOpen ? ' open' : ''}`}>
        <div className="bottom-sheet__handle" />
        {children}
      </div>
    </>
  )
}
