import React from "react";

interface Card2Props {
  bgImage: string;
  icon: React.ReactNode;
  title: string;
  subText: string;
  value: number | string;
  iconBg?: string;
  iconTextColor?: string;
}

// helper function for Indian number formatting
const formatIndianNumber = (num: number | string): string => {
  if (typeof num !== "number") {
    const parsed = Number(num);
    if (isNaN(parsed)) return String(num);
    num = parsed;
  }

  if (num >= 10000000) {
    return (num / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(1).replace(/\.0$/, "") + " L";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + " K";
  }
  return String(num);
};

console.log('number ',formatIndianNumber(120))

const Card2: React.FC<Card2Props> = ({
  bgImage,
  icon,
  title,
  subText,
  value,
  iconBg = "bg-transparent",
  iconTextColor = "text-black",
}) => {
  return (
    <div
      className="bg-right bg-cover bg-no-repeat p-4 rounded-lg w-[407px] shadow-lg h-[127px] flex flex-col justify-between"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div
            className={`h-10 w-10 flex items-center justify-center rounded-full ${iconBg}`}
          >
            <div className={iconTextColor}>{icon}</div>
          </div>
          <p className="font-medium text-gray-800 text-xl">{title}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{subText}</p>
        </div>
      </div>

      <div className="flex text-2xl font-bold text-gray-800">
        {formatIndianNumber(value)}
      </div>
    </div>
  );
};

export default Card2;
