import { Dispatch, SetStateAction } from "react";
import { HiMiniXMark } from "react-icons/hi2";

const ImagePopup = ({
  image,
  overlay,
}: {
  image: string;
  overlay: Dispatch<SetStateAction<string | undefined | null>>;
}) => {
  return (
    <div className="fixed inset-0  bg-base-100/50 backdrop-blur-xl z-50 flex justify-center items-center ">
      <button
        className="btn btn-square fixed right-10 top-10"
        onClick={() => overlay(null)}
      >
        <HiMiniXMark />
      </button>
      <img src={image} className="h-5/6 object-scale-down rounded-xl" />
    </div>
  );
};
export default ImagePopup;
