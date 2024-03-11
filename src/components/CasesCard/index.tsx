"use client";
import { ICases } from "@/types";
import React, { useState } from "react";
import { Box, CircularProgress, Modal, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "@/stores/reducers/notificationReducer";
import DeleteCases from "@/apiHelper/deleteCases";
import UpdateCases from "@/apiHelper/updateCases";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillCloseSquare, AiFillDelete } from "react-icons/ai";

const CasesCard = ({
  item,
  refresh,
}: {
  item: ICases;
  refresh: () => void;
}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [year, setYear] = useState(item.year);
  const [timeframe, setTimeframe] = useState(item.timeframe);
  const [main_service, setMainService] = useState(item.main_service);
  const [extra_service, setExtraService] = useState(item.extra_service);
  const [return_on_investment, setReturnOnInvestment] = useState(
    item.return_on_investment
  );
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState(item.description);
  const [cover_image, setCoverImage] = useState(item.cover_image);
  const user = useSelector((state: any) => state.general.user);

  const style = {
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "2px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    "&": {
      scrollbarWidth: "thin",
      scrollbarColor: "#888 #555",
    },
    position: "absolute" as "absolute",
   
    maxHeight: "100vh",
    left: 0,
    right: 0,
    margin: "auto",
    bgcolor: "#d9d3d2",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    color: "white",
    overflow: "auto",
  };

  const handleSubmit = async (_id: string) => {
    setLoading(true);
    const response = await UpdateCases({
      _id,
      title: title,
      year: year,
      timeframe: timeframe,
      main_service: main_service,
      extra_service: extra_service,
      return_on_investment: return_on_investment,
      description: description,
      cover_image: cover_image,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Cases updated successfully",
          open: true,
          severity: "success",
        })
      );
      setLoading(false);
      setTitle("");
      setYear("");
      setTimeframe("");
      setMainService("");
      setExtraService("");
      setReturnOnInvestment("");
      setDescription("");
      setCoverImage("");
      refresh();
    } else {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Form submission failed",
          open: true,
          severity: "error",
        })
      );
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    const response = await DeleteCases({
      _id,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Case  deleteted successfully",
          open: true,
          severity: "success",
        })
      );
      refresh();
    } else {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: " failed to delete case",
          open: true,
          severity: "error",
        })
      );
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className=" py-6 lg:px-20 px-10">
      <div className="border rounded-lg h-auto  lg:h-[45vh] xl:h-[45vh] 3xl:h-[40vh] p-1 flex justify-center md:justify-evenly bg-brand_bg bg-opacity-40 flex-wrap overflow-auto">
        <div className="h-[50%] md:h-full  md:pr-5 w-full md:w-6/12 lg:w-3/12">
          <img
            className="w-full rounded-md h-full object-cover overflow-hidden"
            src={item.cover_image}
          />
        </div>

        
        <div className="p-4 bg-white rounded-md w-full md:w-6/12 lg:w-3/12">
          <h2 className="font-semibold text-brand_headings lg:text-lg xl:text-xl">
            Client: <span className="font-light">{item.title}</span>
          </h2>
          <p className="text-black font-semibold md:pt-3  lg:text-sm lg:pt-3 xl:pt-8">
            Year:
            <span className="text-brand_text font-light"> {item.year}</span>
          </p>
          <p className="text-black font-semibold md:pt-3 lg:text-sm lg:pt-3 xl:pt-8">
            Timeframe:{" "}
            <span className="text-brand_text font-light">{item.timeframe}</span>
          </p>
          <p className="text-black font-semibold md:pt-3 lg:text-sm lg:pt-3 xl:pt-8">
            Main Service:
            <span className="text-brand_text font-light">
              {item.main_service}
            </span>{" "}
          </p>
          <p className="text-black font-semibold md:pt-3 lg:text-sm lg:pt-3 xl:pt-8">
            Extra Service:
            <span className="text-brand_text font-light">
              {" "}
              {item.extra_service}
            </span>{" "}
          </p>
          <div className="flex pt-3 space-x-5">
            <div onClick={() => setOpenModal(true)} className="">
              <BsFillPencilFill />
            </div>
            <div
              onClick={() => item._id && handleDelete(item._id)}
              className=" "
            >
              <AiFillDelete />
            </div>
          </div>
        </div>

       
        <div className="w-full md:w-full rounded-md lg:w-6/12 lg:pl-4">
          <div className="h-full rounded-md bg-white ">
            <div
              className={` rounded-md   transition-max-height duration-500 ${
                isExpanded ? "max-h-[100%] bg-white" : "max-h-[30%] bg-white"
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="text-sm text-brand_text w-full h-full">
                <p className="  p-3 ">
                  {!isExpanded
                    ? `${item.description.slice(0, 200)}`
                    : `${item.description}`}
                </p>
                <button className="pl-2 rounded-md text-blue-500 hover:underline self-end">
                  View {isExpanded ? "Less" : "More"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative ">
        <Modal
          className="flex items-center justify-center"
          open={openModal}
          onClose={handleCloseModal}
        >
          <Box sx={style} className="w-[300px] md:w-[500px] lg:w-[700px]">
            <div className="w-full relative overflow-auto">
              <div
                onClick={handleCloseModal}
                className="z-10 absolute cursor-pointer top-0 text-2xl  text-brand_secondary right-5"
              >
                <AiFillCloseSquare />
              </div>

              <div className="">
                <div className="pt-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="pt-3">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="pt-3">
                  <label
                    htmlFor="timeframe"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Timeframe
                  </label>
                  <input
                    type="text"
                    name="timeframe"
                    id="timeframe"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="pt-3">
                  <label
                    htmlFor="main_service"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Main Service
                  </label>
                  <input
                    type="text"
                    name="main_service"
                    id="main_service"
                    value={main_service}
                    onChange={(e) => setMainService(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="pt-3">
                  <label
                    htmlFor="extra_service"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Extra Service
                  </label>
                  <input
                    type="text"
                    name="extra_service"
                    id="extra_service"
                    value={extra_service}
                    onChange={(e) => setExtraService(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="pt-3">
                  <label
                    htmlFor="return_on_investment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Return on Investment
                  </label>
                  <input
                    type="text"
                    name="return_on_investment"
                    id="return_on_investment"
                    value={return_on_investment}
                    onChange={(e) => setReturnOnInvestment(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="pt-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  ></textarea>
                </div>

                <div className="pt-3">
                  <label
                    htmlFor="cover_image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    name="cover_image"
                    id="cover_image"
                    value={cover_image}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div>
                  <button
                    onClick={() => item._id && handleSubmit(item._id)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    {loading ? (
                      <div className="text-white ">
                        <CircularProgress color="inherit" size={20} />
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default CasesCard;
