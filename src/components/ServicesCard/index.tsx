"use client";
import { IServices } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import DeleteService from "@/apiHelper/deleteServices";
import { addNotification } from "@/stores/reducers/notificationReducer";
import { Box, CircularProgress, Modal } from "@mui/material";
import { RiCloseFill } from "react-icons/ri";
import UpdateService from "@/apiHelper/updateService";
import fetchServices from "@/apiHelper/fetchServices";

const ServiceCard = ({ item,refresh }: { item: IServices, refresh: ()=>void }) => {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.general.user);

  const [loading, setLoading] = useState(false);


  function truncateText(text:string, maxLength:number) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }

  const handleDelete = async (_id: string) => {
    const response = await DeleteService({
      _id,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Service  deleteted successfully",
          open: true,
          severity: "success",
        })
      );
      refresh()
    } else {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: " failed to delete service",
          open: true,
          severity: "error",
        })
      );
    }
  };

  return (
    <div className="w-full md:w-6/12 lg:w-4/12 py-10 px-4  ">
      <div className=" p-2" key={item.slug}>
        <div className=" rounded-md card border servicesCardShadow h-[40vh]">
          <div className="rounded-t-md relative h-[70%]">
            <Link href={`/all-services/${item.slug}`}>
              <div className=" rounded-t-md h-full">
                <img
                  className="w-full rounded-t-md h-full object-cover"
                  src={item.cover_image}
                />
              </div>

              <div className="w-full rounded-md h-full top-0 bottom-0 left-0 right-0 flex items-end pb-4 text-white font-semibold bg-black bg-opacity-20 absolute  pl-3">
                <p>{item.title}</p>
              </div>
            </Link>
          </div>
          <div className="h-[30%] rounded-b-md px-2 bg-white  ">
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-[12px] text-brand_text">
                {truncateText(item.short_description, 50)}
                </p>
              </div>
              <Link shallow href={`/all-services/${item.slug}`}>
                <div className="text-3xl text-brand_headings">
                  <BiRightArrowAlt />
                </div>
              </Link>
            </div>
            <div className="pt-3 text-brand_secondary flex justify-end text-md">
              <div
                onClick={() => item._id && handleDelete(item._id)}
                className="cursor-pointer z-50"
              >
                <AiFillDelete />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
