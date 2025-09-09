import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  subText: string;
  percentage?: number;
  icon: React.ReactNode;
  iconBg?: string;
  iconTextColor?: string;
}

const Card1: React.FC<CardProps> = ({
  title,
  value,
  subText,
  icon,
  iconBg = "bg-gray-400",
  iconTextColor = "text-white",
}) => {
  const formatValue =
    typeof value === "number"
      ? value.toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        })
      : value;

  return (
    <div className="bg-white rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] p-4  h-[166px] flex flex-col justify-between font-">
      {/* Header */}
      <div className="flex gap-3 items-center">
        <div
          className={`h-10 w-10 flex items-center justify-center rounded-full shadow-lg ${iconBg} ${iconTextColor}`}
        >
          {icon}
        </div>
        <h3 className="text-[#7D7D7D] font-medium">{title}</h3>
      </div>

      {/* Main Value */}
      <div className="text-3xl font-bold text-black mt-3">
        {typeof value === "number" && title.toLowerCase().includes("revenue")
          ? `₹${formatValue}`
          : formatValue}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-[#7D7D7D]">{subText}</span>
      </div>
    </div>
  );
};

export default Card1;
