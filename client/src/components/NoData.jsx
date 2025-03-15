import React from "react";
import noDataImage from "../assets/no-data-found.svg";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center w-full">
      <img src={noDataImage} alt="No Data" className="w-40 h-40 object-cover" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Oops! No Data Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Looks like there's nothing here yet.
      </p>
    </div>
  );
};

export default NoData;
