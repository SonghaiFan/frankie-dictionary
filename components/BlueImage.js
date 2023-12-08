import Image from "next/image";
import { useState, useEffect } from "react";

const BlueImage = () => {
  const [randomImageIndex, setRandomImageIndex] = useState(1);

  useEffect(() => {
    setRandomImageIndex(Math.floor(Math.random() * 6) + 1);
  }, []);

  // Define the width and height of your images
  const imageWidth = 300;
  const imageHeight = 300;

  return (
    <div className="flex justify-center bg-kleinBlue rounded mb-2">
      <div className="relative md:w-[300px] md:h-[300px] w-[100px] h-[100px] rounded-full shadow-lg overflow-hidden">
        <Image
          src={`/images/Blue_Photo${randomImageIndex}.jpg`}
          alt="Blue_Photo"
          width={imageWidth}
          height={imageHeight}
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          priority
        />
      </div>
    </div>
  );
};

export default BlueImage;
