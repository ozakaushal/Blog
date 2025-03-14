import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from "react-icons/bs";

const FooterComponent = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full mx-auto p-2">
        <div className="flex justify-between items-center max-md:flex-col max-md:gap-3 max-md:items-start">
          {/* logo */}
          <div className="">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl md:text-2xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
                Kaushal's
              </span>
              <span className="text-black">Blog</span>
            </Link>
          </div>
          {/* items */}
          <div className="grid mt-8 grid-cols-2 gap-8 lg:mt-4 lg:grid-cols-4 lg:gap-6 md:grid-cols-3 sm:grid-cols-2 max-sm:w-full">
            <div>
              <Footer.Title title="About"></Footer.Title>
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank">
                  test 1 link
                </Footer.Link>
                <Footer.Link href="#">Kaushl's blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="max-md:w-full">
              <Footer.Title title="Follow us"></Footer.Title>
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank">
                  test 1 link
                </Footer.Link>
                <Footer.Link href="#">Kaushl's blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="max-md:w-full">
              <Footer.Title title="Follow us"></Footer.Title>
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank">
                  test 1 link
                </Footer.Link>
                <Footer.Link href="#">Kaushl's blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="max-md:w-full">
              <Footer.Title title="Legal"></Footer.Title>
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#">Terms and Condition</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider></Footer.Divider>
        <div className="flex justify-between items-center">
          <Footer.Copyright
            href="#"
            by="Kaushal's blog"
            year={new Date().getFullYear()}
          ></Footer.Copyright>
          <div className="flex items-center gap-4">
            <Footer.Icon href="#" icon={BsFacebook}></Footer.Icon>
            <Footer.Icon href="#" icon={BsInstagram}></Footer.Icon>
            <Footer.Icon href="#" icon={BsGithub}></Footer.Icon>
            <Footer.Icon href="#" icon={BsTwitter}></Footer.Icon>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
