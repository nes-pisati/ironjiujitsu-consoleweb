import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AlertDialogProps = {
  show: boolean,
  title: string,
  message: string,
  onConfirm: () => void,
  onClose: () => void,
  isDeleted: boolean
}

const AlertDialog: React.FC<AlertDialogProps> = ({ show, onConfirm, onClose, title, message, isDeleted }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center opacity-100">
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          {!isDeleted &&
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-700 text-white rounded-xl hover:bg-red-800 transition"
            >
              <div className="gap-2 flex items-center">
                <FontAwesomeIcon icon={faTrash} />
                <p>Conferma</p>
              </div>
            </button>
          }
          <button
            onClick={onClose}
            className="px-4 py-2 border-1 border-black hover:bg-black text-black hover:text-white rounded-xl transition"
          >
            <div className="gap-2 flex items-center">
              <FontAwesomeIcon icon={faTrash} />
              <p>Chiudi</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
