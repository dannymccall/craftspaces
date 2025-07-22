import React from "react";

type ListComponentProps = {
  data: any[];
  renderItem: (item: any) => React.ReactNode;
};
const ListComponent = ({ data, renderItem }: ListComponentProps) => {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {data.map((item) => renderItem(item))}
    </div>
  );
};

export default ListComponent;
