const Footer = () => {
  return (
    <footer className="fixed bg-kleinBlue text-white text-sm text-center p-2 md:p-4 bottom-0 w-full">
      <div>
        <span>Contributors: </span>(
        <a className="text-blue-300 "> 范松海Frank </a>|
        <a className="text-blue-300 "> 海苔Chrispy </a>)
      </div>
      <div className="text-sm ">
        Acknowledgement: <a className="text-blue-300 "> 上山养大猫 </a>
      </div>
      <div className="text-sm mb-5">
        <span>© 2023 蓝字典 Blue Dictionary®</span>
      </div>
    </footer>
  );
};

export default Footer;
