const PopImage = ({ BackgroundColor, ImagePath }) => {
  return (
<div className="relative max-w-64 m-4 person">
      <div className="aspect-[1/2] grid 
      items-end rounded-b-[120vw] 
      overflow-hidden ">
        {/* Background Circle */}
        <div
          style={{ backgroundColor: BackgroundColor }}
          className="absolute inset-x
          bottom-0  w-full aspect-square 
          rounded-[60%] object-cover ring-2 
          ring-gray-300 "
        ></div>

        {/* Foreground Person Image */}
        <img
          src={ImagePath}
          className="relative z-3 top-3 right-1  w-52 h-auto object-contain transform transition-transform duration-250 ease-in-out hover:scale-110 hover:-translate-y-4"
          alt="Person"
        />
      </div>
    </div>
  );
};

export default PopImage;
