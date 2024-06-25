import React from "react";

const MyButton = ({ text, func, classRest, ...rest }) => {
  return (
    <button
      className={`p-2 bg-black h-[50px] my-1 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]  before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-[#fff] bg-neutral ${classRest}`}
      onClick={func}
      rest={rest}
    >
      {text}
    </button>
  );
};
export default MyButton;
