import React, { useState } from "react";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const CardContent = ({
  date,
  image,
  title,
  subtitle,
  url,
  sourceName,
  sourceUrl,
}) => {
  return (
    <div className="w-full bg-white shadow-md overflow-hidden bg-white/70 hover-box-shadow rounded-lg group hover:scale-105 transition-all duration-300 ease-in-out">
      <div className="md:flex">
        <div className="md:shrink-0 bg-secondary-200 opacity-70 transition-all duration-300 ease-in-out group-hover:opacity-100">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={image}
            alt="Image"
          />
        </div>
        <div className="py-4 px-6 relative">
          <h3 className="flex gap-x-1.5 pb-1 items-center text-xs text-slate-400 font-semibold">
            <FaClock className="w-2.5 h-2.5 flex-none opacity-50" />
            {date}
          </h3>
          <h2 className="uppercase text-xl font-bold text-primary-200">
            {title}
          </h2>
          <a
            href={sourceUrl}
            target="_blank"
            className="text-xs italic text-slate-400 transition-all hover:text-slate-600 duration-300"
          >
            &mdash; {sourceName}
          </a>
          <div className="mt-4 pb-16">
            <p>{subtitle}</p>
          </div>
          <div className="absolute bottom-6 w-full">
            <Link
              to={url}
              className="uppercase py-2 px-4 text-xs rounded-full hover-box-shadow font-medium transition-all duration-300 text-white bg-primary-200 hover:bg-primary-200/70"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardContent;
