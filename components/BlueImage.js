import Image from "next/image";
import { useState, useEffect } from "react";

const BlueImage = () => {
  const [randomImageIndex, setRandomImageIndex] = useState(1);

  useEffect(() => {
    setRandomImageIndex(Math.floor(Math.random() * 6) + 1);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="sm:w-[300px] sm:h-[300px] w-[100px] h-[100px] rounded-full shadow-lg mb-5 overflow-hidden relative">
        <Image
          className="rounded-full"
          src={`/images/Blue_Photo${randomImageIndex}.jpg`}
          alt="Blue_Photo"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
};

export default BlueImage;
