import { BsEnvelopePaper, BsPhone } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { HiMenu, HiOutlineMenuAlt1 } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import {
  SlSocialInstagram,
  SlSocialLinkedin,
  SlSocialTwitter,
} from "react-icons/sl";
import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import {
  CLIENT_ADDRESS,
  CLIENT_EMAIL,
  CLIENT_GMAP_DIRECTION,
  CLIENT_IG,
  CLIENT_LI,
  CLIENT_PHONE,
} from "../../../vars/types";
import { Link, useLocation } from "react-router-dom";
import { LOGO_IMG } from "../../../vars/assets";
import { CLIENT_TW } from "../../../vars/types";
import DefaultAction from "../../../action/DefaultAction";
import AuthAction from "../../../action/AuthAction";
import { A_NEWS_PREFERED_CATEGORY, A_U_CATEGORY } from "../../../vars/api";
import dataStore from "../../../store/dataStore";
import { W_NEWS, W_SIGNIN } from "../../../vars/web";
import DropdownProfile from "../../../components/dropdown/DropdownProfile";
import ModalConfirm from "../../../components/modal/ModalConfirm";
import authStore from "../../../store/authStore";

const Header = ({ isMenuWhite }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [burgerAnimate, setBurgerAnimate] = useState(false);

  const navMenuRef = useRef(null);
  const location = useLocation();
  const { pathname } = location;

  const { getMenuData } = DefaultAction();
  const { menuData } = dataStore((state) => state);
  const { token, name } = authStore((state) => state);

  // signout event
  const [noticeSignout, setNoticeSignout] = useState(false);
  const { signoutAPI } = AuthAction();

  useEffect(() => {
    getMenuData(token ? A_NEWS_PREFERED_CATEGORY : A_U_CATEGORY, {}, {}, false);
  }, [token]);

  //   switch show menu burger to true
  useEffect(() => {
    let timeout;
    if (showMenu) timeout = setTimeout(() => setBurgerAnimate(true), 100);

    return () => clearTimeout(timeout);
  }, [showMenu]);

  //   switch show menu burger to false
  useEffect(() => {
    let timeout;
    if (!burgerAnimate) timeout = setTimeout(() => setShowMenu(false), 100);

    return () => clearTimeout(timeout);
  }, [burgerAnimate]);

  // close on click outside
  useEffect(() => {
    const clickHandler = (e) => {
      const { target } = e;

      if (!showMenu || navMenuRef?.current?.contains(target)) return;

      setBurgerAnimate(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = (e) => {
      const { keyCode } = e;

      if (!showMenu || keyCode !== 27) return;
      setBurgerAnimate(false);
    };

    if (showMenu) {
      document.addEventListener("keydown", keyHandler);
    }
    return () => document.removeEventListener("keydown", keyHandler);
  });

  //   switch showing burger menu event
  const showBurgerMenu = () => {
    if (!showMenu) setShowMenu(true);
    else setBurgerAnimate(false);
  };

  const linkTo = (e) => {
    e.preventDefault();
    let id = e.target.getAttribute("href").toString();

    if (id.includes("/")) id = id.slice(1);

    // escape when not have #
    if (!id.includes("#")) return;

    const target = document.querySelector(id);
    if (target)
      target.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <>
      {/* top bar */}
      <div className="w-full relative bg-primary-800 bg-divider hidden md:block">
        <div className="container mx-auto flex justify-between relative text-xs">
          <ul className="flex gap-x-8 text-slate-400 py-2">
            <a href={CLIENT_GMAP_DIRECTION} target="_blank" className="h-fit">
              <li className="flex gap-x-2 items-center hover:text-primary-50 cursor-pointer transition-all duration-300">
                <FiMapPin className="w-4 h-4 flex-none" />
                {CLIENT_ADDRESS}
              </li>
            </a>
            <a href={`mailto:${CLIENT_EMAIL}`} className="h-fit">
              <li className="flex gap-x-2 items-center hover:text-primary-50 cursor-pointer transition-all duration-300">
                <BsEnvelopePaper className="w-4 h-4 flex-none" />
                {CLIENT_EMAIL}
              </li>
            </a>
            <a href={`tel:${CLIENT_PHONE}`} className="h-fit">
              <li className="flex gap-x-2 items-center hover:text-primary-50 cursor-pointer transition-all duration-300">
                <BsPhone className="w-4 h-4 flex-none" />
                {CLIENT_PHONE}
              </li>
            </a>
          </ul>
          <ul className="flex gap-x-6 text-slate-400 py-2">
            <a href={CLIENT_IG} target="_blank">
              <li className="flex gap-x-2 items-center hover:text-primary-50 cursor-pointer transition-all duration-300">
                <SlSocialInstagram className="w-4 h-4" />
              </li>
            </a>
            <a href={CLIENT_TW} target="_blank">
              <li className="flex gap-x-2 items-center hover:text-primary-50 cursor-pointer transition-all duration-300">
                <SlSocialTwitter className="w-4 h-4" />
              </li>
            </a>
            <a href={CLIENT_LI} target="_blank">
              <li className="flex gap-x-2 items-center hover:text-primary-50 cursor-pointer transition-all duration-300">
                <SlSocialLinkedin className="w-4 h-4" />
              </li>
            </a>
          </ul>
        </div>
      </div>

      {/* navbar */}
      <header className="z-[2] w-full h-[6.3rem] sticky inset-0 bg-transparent">
        <div
          className={classNames(
            "transition-all duration-300 ease-in-out flex items-center",
            {
              "h-[6.3rem]": !isMenuWhite,
              "bg-white h-16 shadow-md": isMenuWhite,
            }
          )}
        >
          <div className="container mx-auto flex justify-between md:items-center relative items-center px-4 md:px-0">
            {/* logo dark */}
            {!isMenuWhite && (
              <Link to="/">
                <img src={LOGO_IMG()} className="w-full h-20" alt="logo" />
              </Link>
            )}

            {/* logo white */}
            {isMenuWhite && (
              <Link to="/">
                <img src={LOGO_IMG()} className="w-full h-14" alt="logo" />
              </Link>
            )}

            {/* menu */}
            <nav
              ref={navMenuRef}
              className={classNames(
                "md:flex items-center gap-6 flex-col transition-all duration-300 ease-in-out absolute w-full py-4 md:py-0 md:bg-transparent md:top-[unset] md:relative md:w-auto md:flex-row",
                {
                  hidden: !showMenu,
                  "flex scale-x-125 translate-y-10 opacity-0":
                    showMenu && !burgerAnimate,
                  "flex scale-x-100 translate-y-0 opacity-100":
                    showMenu && burgerAnimate,
                  "text-slate-400": isMenuWhite && !showMenu,
                  "top-24 text-slate-600 bg-white/80": !isMenuWhite && showMenu,
                  "top-[3.75rem] text-slate-600 bg-white":
                    isMenuWhite && showMenu,
                }
              )}
            >
              <Link
                to="/"
                className={classNames(
                  "uppercase transition-all duration-300 hover:text-primary-100 hover:scale-x-105",
                  { "text-primary-100": pathname == "/" }
                )}
              >
                Home
              </Link>

              <Link
                to={W_NEWS}
                className={classNames(
                  "uppercase transition-all duration-300 hover:text-primary-100 hover:scale-x-105",
                  { "text-primary-100": pathname == "/news" }
                )}
              >
                News
              </Link>

              {menuData.map((e, i) => (
                <Link
                  key={`${i}-${e.code}-menu`}
                  to={`/news?category=${e.code}`}
                  className={classNames(
                    "uppercase transition-all duration-300 hover:text-primary-100 hover:scale-x-105",
                    { "text-primary-100": pathname.includes(`/news/${e.code}`) }
                  )}
                >
                  {e.name}
                </Link>
              ))}
              {token ? (
                <DropdownProfile
                  align="right"
                  noticeSignout={noticeSignout}
                  setNoticeSignout={setNoticeSignout}
                  isMenuWhite={isMenuWhite}
                />
              ) : (
                <Link
                  to={W_SIGNIN}
                  className={classNames(
                    "w-24 uppercase py-2 px-4 text-sm text-center rounded-full hover-box-shadow font-medium transition-all duration-300 hover:scale-x-105 text-white",
                    {
                      "bg-primary-400 hover:bg-primary-400/70": isMenuWhite,
                      "bg-primary-200 hover:bg-primary-200/70": !isMenuWhite,
                    }
                  )}
                >
                  sign in
                </Link>
              )}
            </nav>

            {/* burger button */}
            <button
              className="md:hidden w-11 h-11 flex items-center justify-center border border-white rounded-lg hover:opacity-70 hover:border-white/70"
              onClick={showBurgerMenu}
            >
              <HiMenu
                className={classNames(
                  "absolute h-10 w-10 transition-all duration-300 ease-in-out ",
                  {
                    "text-slate-400": isMenuWhite,
                    "rotate-45 opacity-45": showMenu,
                    "opacity-0": burgerAnimate,
                  }
                )}
              />
              <RiCloseLine
                className={classNames(
                  "absolute h-10 w-10 transition-all duration-300 opacity-45 rotate-45 ease-in-out ",
                  {
                    "text-slate-400": isMenuWhite,
                    "opacity-50": showMenu,
                    "opacity-0": (!burgerAnimate && showMenu) || !showMenu,
                    "rotate-90 opacity-100": burgerAnimate,
                  }
                )}
              />
            </button>
          </div>
        </div>
      </header>
      <ModalConfirm
        modalOpen={noticeSignout}
        message="Are you sure to end your session?"
        closeModal={() => setNoticeSignout(false)}
        action={() => signoutAPI()}
      />
    </>
  );
};

export default Header;
