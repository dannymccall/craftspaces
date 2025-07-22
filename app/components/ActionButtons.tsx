import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap sm:justify-center items-center gap-2 w-full">
      {onView && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 cursor-pointer rounded-md border border-emerald-500 px-3 py-1 text-sm text-emerald-600 hover:font-bold transition hover:bg-emerald-500 hover:text-black"
          onClick={onView}
        >
          <FaEye className="text-gold-400" />
          {viewLabel}
        </motion.button>
      )}
      {onEdit && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 cursor-pointer rounded-md border border-amber-300 px-3 py-1 text-sm text-amber-400 hover:font-bold  transition hover:bg-amber-300 hover:text-black"
          onClick={onEdit}
        >
          <FaEdit />
          {editLabel}
        </motion.button>
      )}
      {onDelete && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 cursor-pointer rounded-md border border-red-500 px-3 py-1 text-sm text-red-500 transition hover:bg-red-500 hover:text-white"
          onClick={onDelete}
        >
          <FaTrash />
          {deleteLabel}
        </motion.button>
      )}
    </div>
  );
};

export default ActionButtons;
