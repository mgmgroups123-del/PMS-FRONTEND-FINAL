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

const Card2: React.FC<Card2Props> = ({
  bgImage,
  icon,
  title,
  subText,
  value,
  iconBg = "bg-white",
  iconTextColor = "text-black",
}) => {
  return (
    <div
      className="bg-right bg-contain bg-no-repeat p-4 rounded-lg  h-[127px] shadow-[2px_2px_5px_rgba(0,0,0,0.25)]  flex flex-col justify-between"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div
            className={`h-10 w-10 flex items-center justify-center rounded-full ${iconBg} shadow-lg`}
          >
            <div className={iconTextColor}>{icon}</div>
          </div>
          <p className="font-medium text-gray-800 text-xl">{title}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{subText}</p>
        </div>
      </div>

      <div className="flex justify-end text-2xl font-bold text-gray-800">
        {value}
      </div>
    </div>
  );
};

export default Card2;
