// components/DataRow.tsx
import React from "react";

interface DataRowProps {
  label: string;
  values: (string | number | React.ReactNode)[];
  className?: string;
  FillEmptySpaces:React.ReactNode
}

const DataRow: React.FC<DataRowProps> = ({ label, values, className = "", FillEmptySpaces }) => {
  const baseCellStyle =
    "font-semibold font-sans text-sm text-gray-900 p-5 text-slate-50 font-bold";

  return (
    <tr className={`text-slate-50 font-bold ${className}`}>
      <td className={baseCellStyle}>{label}</td>
      {FillEmptySpaces}
      {values.map((val, i) => (
        <td key={i} className={baseCellStyle}>
          {val}
        </td>
      ))}
    </tr>
  );
};

export default DataRow;
