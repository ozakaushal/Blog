import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">Want to learn more about javascript?</h2>
        <p className="text-gray-500 my-2">
          Checkout this resources with 100 javascript projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a href="#" target="_blank" rel="noopener noreferrer">
            100 Javascript projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK8QngSC8uf0TrtmPKHaxCkz49b6gG7gsb2w&s"
          alt="banner"
        />
      </div>
    </div>
  );
};

export default CallToAction;
