import logo from "@/assets/transparentLogo.png";

const Header = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="w-full">
        <div className="flex justify-center">
          <img src={logo} alt="BpXchange" className="h-12 md:h-16" />
        </div>
        <h1 className="text-3xl font-bold text-[#545454] text-center">
          Sign up
        </h1>
      </div>
    </div>
  );
};

export default Header;
