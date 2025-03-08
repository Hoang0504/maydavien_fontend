type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Dialog({ open, onClose, children }: DialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
