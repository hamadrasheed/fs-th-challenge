import { BsEnvelopePaper, BsPhone } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import {
  SlSocialInstagram,
  SlSocialLinkedin,
  SlSocialTwitter,
} from "react-icons/sl";
import GoogleMap from "../../../components/GoogleMap";
import {
  CLIENT_NAME,
  CLIENT_ADDRESS,
  CLIENT_EMAIL,
  CLIENT_GMAP_DIRECTION,
  CLIENT_PHONE,
  CLIENT_URL,
  CLIENT_PP_URL,
  CLIENT_TNC_URL,
  CLIENT_IG,
  CLIENT_LI,
  CLIENT_TW,
  APP_TAGLINE,
  APP_NAME,
} from "../../../vars/types";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import darkModeStore from "../../../store/darkModeStore";
import { LOGO_IMG, LOGO_WHITE_IMG } from "../../../vars/assets";

const Footer = () => {
  const [date, setDate] = useState();
  const getYear = () => setDate(new Date().getFullYear());
  const [scrollTop, setScrollTop] = useState(0);
  const [isShow, setShow] = useState(false);

  const { show: darkMode } = darkModeStore((state) => state);

  const onScroll = (e) => {
    const winScroll = e.target.scrollTop;
    const height = e.target.scrollHeight - e.target.clientHeight;
    const scrolled = (winScroll / height) * 100;
    setScrollTop(scrolled);

    setShow((isShow) => {
      if (!isShow && (e.target.scrollTop > 20 || e.target.scrollTop > 20)) {
        return true;
      }

      if (isShow && e.target.scrollTop < 4 && e.target.scrollTop < 4) {
        return false;
      }

      return isShow;
    });
  };

  useEffect(() => {
    getYear();

    document
      .getElementById("wrapper")
      .addEventListener("scroll", (e) => onScroll(e));
    return () => {
      const scrollEvent = document.getElementById("wrapper");
      if (scrollEvent)
        scrollEvent.removeEventListener("scroll", (e) => onScroll(e));
    };
  }, []);

  return (
    <>
      <footer className="flex flex-col items-center relative w-full bg-primary-800 pt-12">
        <div className="container mx-auto grid md:grid-cols-2 xl:grid-cols-4 gap-x-20 gap-y-4">
          {/* compro short */}
          <div className="relative">
            <Link to="/">
              <img
                src={darkMode ? LOGO_WHITE_IMG() : LOGO_IMG()}
                className="w-1/3 md:w-2/3"
                alt="logo"
              />
            </Link>

            <p className="text-sm text-justify pt-5 md:pt-2">
              Stay informed and up-to-date with the latest news and stories from
              around the world by visiting us: {APP_NAME}, {APP_TAGLINE}!
            </p>

            <div className="pt-6 pb-4 md:pb-10">
              <h4 className="uppercase font-semibold tracking-wide pb-3">
                Subscribe Newsletter
              </h4>
              <div className="flex relative transition-all duration-300 group">
                <input
                  placeholder="Enter your email address..."
                  type="email"
                  className="w-full placeholder-slate-400 pr-12 bg-primary-900 outline-none rounded-full py-3 px-3 text-sm transition-all ease-in-out duration-300 group-hover:scale-x-105"
                />
                <button className="absolute right-0 flex justify-center items-center bg-primary-200 hover:opacity-70 transition-all ease-in-out duration-300 rounded-full text-white w-12 h-12  group-hover:scale-105 group-hover:-right-1">
                  <FaPaperPlane className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* contact */}
          <div className="flex flex-col gap-2 pb-4 md:pb-10">
            <div>
              <h4 className="uppercase font-semibold tracking-wide xl:pt-10">
                get in touch
              </h4>
              <ul className="flex flex-col divide-y divide-slate-400/50 text-slate-400 py-2">
                <a href={CLIENT_GMAP_DIRECTION} target="_blank">
                  <li className="transition-all ease-in-out duration-300 hover:translate-x-1 py-3 flex gap-x-2 items-center hover:text-primary-50">
                    <FiMapPin className="w-4 h-4 flex-none" />
                    {CLIENT_ADDRESS}
                  </li>
                </a>
                <a href={`mailto:${CLIENT_EMAIL}`}>
                  <li className="transition-all ease-in-out duration-300 hover:translate-x-1 py-3 flex gap-x-2 items-center hover:text-primary-50">
                    <BsEnvelopePaper className="w-4 h-4 flex-none" />
                    {CLIENT_EMAIL}
                  </li>
                </a>
                <a href={`tel:${CLIENT_PHONE}`}>
                  <li className="transition-all ease-in-out duration-300 hover:translate-x-1 py-3 flex gap-x-2 items-center hover:text-primary-50">
                    <BsPhone className="w-4 h-4 flex-none" />
                    {CLIENT_PHONE}
                  </li>{" "}
                </a>
              </ul>
            </div>
            <ul className="flex gap-x-6 text-white md:pt-2">
              <a href={CLIENT_IG} target="_blank">
                <li className="flex justify-center gap-x-2 items-center hover:bg-primary-200 hover:border-none hover:text-white cursor-pointer transition-all ease-in-out duration-300 border border-slate-400 rounded-full w-10 h-10 hover:scale-110 hover:-translate-y-1">
                  <SlSocialInstagram className="w-4 h-4" />
                </li>
              </a>
              <a href={CLIENT_TW} target="_blank">
                <li className="flex justify-center gap-x-2 items-center hover:bg-primary-200 hover:border-none hover:text-white cursor-pointer transition-all ease-in-out duration-300 border border-slate-400 rounded-full w-10 h-10 hover:scale-110 hover:-translate-y-1">
                  <SlSocialTwitter className="w-4 h-4" />
                </li>
              </a>
              <a href={CLIENT_LI} target="_blank">
                <li className="flex justify-center gap-x-2 items-center hover:bg-primary-200 hover:border-none hover:text-white cursor-pointer transition-all ease-in-out duration-300 border border-slate-400 rounded-full w-10 h-10 hover:scale-110 hover:-translate-y-1">
                  <SlSocialLinkedin className="w-4 h-4" />
                </li>
              </a>
            </ul>
          </div>

          {/* latest blog */}
          <div
            id="google-map"
            className="gmap md:col-span-2 xl:mt-10 h-[17rem] md:h-3/4 mb-6 md:mb-0"
          >
            <GoogleMap />
          </div>
        </div>
        <div className="w-full bg-primary-900">
          <div className="container mx-auto py-4 flex justify-between text-xs">
            <p>
              &copy; {date} &nbsp;
              <a
                href={CLIENT_URL}
                className="text-primary-50 transition-all hover:text-primary-500 duration-300"
              >
                {CLIENT_NAME}
              </a>
              . All rights reserved.
            </p>
            <div className="flex divide-x text-right">
              <a
                href={CLIENT_PP_URL}
                target="_blank"
                className="px-4 hover:text-primary-200 cursor-pointer transition-all duration-300"
              >
                Terms & Conditions{" "}
              </a>
              <a
                href={CLIENT_TNC_URL}
                target="_blank"
                className="px-4 hover:text-primary-200 cursor-pointer transition-all duration-300"
              >
                Privacy & Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed mb-0 bottom-0 left-0 w-full rounded-none z-20 h-[5px]">
        <div
          className={classNames(
            "h-full transition duration-500 ease-in-out w-full bg-primary-400",
            { "bg-primary-500": scrollTop > 99 }
          )}
          style={{ width: `${scrollTop}%` }}
        ></div>
      </div>
      <div
        className={classNames(
          "gotoTop fixed z-30 text-center text-white cursor-pointer transition duration-200 ease-linear opacity-0 hover:bg-primary-200",
          { "opacity-100": isShow, "opacity-0": !isShow }
        )}
        onClick={() =>
          document
            .getElementById("wrapper")
            .scroll({ top: 0, left: 0, behavior: "smooth" })
        }
      ></div>
    </>
  );
};

export default Footer;
