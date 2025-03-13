type DialogProps = {
  width?: number;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Dialog({
  width = 384,
  open,
  onClose,
  children,
}: DialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        style={{ maxWidth: `${width}px` }}
        className="bg-white rounded-lg shadow-lg w-full max-h-screen overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
