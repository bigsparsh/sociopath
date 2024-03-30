import { Dispatch, SetStateAction } from "react";

const ImagePopup = ({ image, overlay }: { image: string; overlay: Dispatch<SetStateAction<string | undefined | null>>; }) => {
  return (
    <div className="fixed inset-0  bg-base-100/50 backdrop-blur-xl z-50 flex justify-center items-center ">
      <button className="btn btn-square fixed right-10 top-10" onClick={() => overlay(null)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <img src={image} className="h-5/6 object-scale-down rounded-xl" />
    </div>
  );
}
export default ImagePopup;
