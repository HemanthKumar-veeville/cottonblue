import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottie from "../../static/img/Loaderr.lottie";

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-50/80 to-indigo-50/80">
      <div className="relative w-full h-full">
        <DotLottieReact
          src={lottie}
          autoplay
          loop
          style={{ width: "100%", height: "100%" }}
        />
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
      </div>
    </div>
  );
};

export default Loader;
