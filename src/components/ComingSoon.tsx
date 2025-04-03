import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottie from "../../static/img/webdesign.lottie";

const ComingSoon: React.FC = () => {
  return (
    <div className="flex  flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <DotLottieReact
        src={lottie}
        autoplay
        loop
        style={{ width: "90%", height: "90%" }}
      />
    </div>
  );
};

export default ComingSoon;
