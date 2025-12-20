import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <div className="flex flex-col items-center space-y-4">
        
        {/* Slow shuriken spin */}
        <div className="w-16 h-16 animate-slow-spin ml-40">
          <div className="relative w-full h-full">
            {[0, 90, 180, 270].map((deg, index) => (
              <div
                key={index}
                className="absolute w-[50%] h-[50%] bg-[#ed3237]"
                style={{
                  top: "25%",
                  left: "25%",
                  transform: `rotate(${deg}deg) translateY(-30%)`,
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                  borderRadius: "2px",
                }}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingOverlay;
