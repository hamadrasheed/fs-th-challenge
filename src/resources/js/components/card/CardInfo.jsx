import { FaClock } from "react-icons/fa";
import { setDateFormat } from "../../helpers/DateHelper";

const CardInfo = () => {
  return (
    <div className="relative min-h-[220px] w-full mt-4 hover-box-shadow bg-secondary-400/70 rounded-xl text-white py-4 px-6 scale-105 transition-all duration-300 ease-in-out">
      <div className="w-full relative">
        {/* title */}
        <div className="absolute w-full left-[-24px] top-[-48px]">
          <img src="/images/person/1.png" className="w-1/2 ml-6" alt="" />
          <div className="w-full rounded-r-xl py-2 pl-2 bg-primary-400">
            <h5 className="flex gap-x-2 items-center text-xs font-semibold">
              <FaClock className="w-3 h-3 flex-none text-slate-400" />
              {setDateFormat({
                date: "2023-05-21 00:00:00",
                withTime: true,
                withWeekDay: true,
              })}
            </h5>
          </div>
        </div>

        {/* content */}
        <div className="pt-40 pb-4">
          <h4 className="text-xl font-['Helvetica'] font-bold pb-4">
            News Title here.
          </h4>
          <p className="pb-4">
            By using a quantity surveying company, a company can ensure that
            costs are properly managed, minimising the risk of cost overruns and
            maximising the return on investment.
          </p>
          <a
            hreg="#"
            className="uppercase py-2 px-4 text-xs rounded-full hover-box-shadow font-medium transition-all duration-300 text-white bg-primary-200 hover:bg-primary-200/70"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
