import React from "react";
import { FaSort, FaFilter } from "react-icons/fa";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
}

interface TableHeaderProps {
  columns: TableColumn[];
  onSort?: (key: string) => void;
  onFilter?: (key: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  onSort,
  onFilter,
}) => {
  return (
    <thead className="bg-neutral-800 text-white border-b border-amber-500 w-full h-full">
      <tr className="w-full">
        {columns.map((col) => (
          <th
            key={col.key}
            className={`text-sm sm:text-base text-amber-300 px-3 py-4 whitespace-nowrap font-semibold text-${col.align || "left"} 
              ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}
            `}
          >
            <div className="flex items-center gap-2 justify-start">
              <span>{col.label}</span>
              {col.sortable && (
                <FaSort
                  className="cursor-pointer text-amber-400 hover:text-yellow-500"
                  size={14}
                  onClick={() => onSort && onSort(col.key)}
                />
              )}
              {col.filterable && (
                <FaFilter
                  className="cursor-pointer text-amber-400 hover:text-yellow-500"
                  size={14}
                  onClick={() => onFilter && onFilter(col.key)}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
