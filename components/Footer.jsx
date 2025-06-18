import OceanWave from "./OceanWave";

const Footer = () => {
  return (
    <div className="relative w-full z-10">
      <OceanWave />
      <footer className="w-full bg-kleinBlue text-white text-xs text-center p-2 md:p-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-1 items-center">
          <div>
            <span>Made by: </span>
            <a href="#" className="text-blue-300">
              范松海Frank
            </a>
          </div>
          <div>
            <span>Acknowledgement: </span>
            <a href="#" className="text-blue-300">
              上山养大猫
            </a>
          </div>
          <div>
            <span>© 2023 蓝色词典 Blue Dictionary®</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
