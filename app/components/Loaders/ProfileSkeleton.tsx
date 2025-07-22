import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="w-full flex gap-5 p-5 mt-20 justify-center h-screen sm:p-10 relative">
      <div className="bg-neutral-900 animate-pulse w-full h-full flex flex-col  shadow-2xl rounded-md md:w-[500px] min-h-96 relative">
        <div className="w-full gap-3 flex flex-col items-center  mt-10">
          <div className="bg-neutral-600 h-24 w-24 rounded-full m-3" />
          <div className="w-1/3 bg-neutral-600 h-3" />
          <div className="w-1/3 bg-neutral-600 h-3" />
        </div>

        <section className="w-full px-10 mt-20">
          <div className="w-full flex flex-col divide-y divide-neutral-700 rounded-md overflow-hidden bg-neutral-800">
            <div className="w-full flex justify-between items-center hover:bg-neutral-700 p-5 transition-all duration-300 cursor-pointer" />

            <div className="w-full flex justify-between items-center hover:bg-neutral-700 p-5 transition-all duration-300 cursor-pointer" />

            <div className="w-full flex justify-between items-center text-red-400 hover:bg-red-900 p-5 transition-all duration-300 cursor-pointer" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
