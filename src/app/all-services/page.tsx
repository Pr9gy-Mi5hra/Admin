"use client";
import React, { useEffect, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import ServicesCard from "@/components/ServicesCard";
import { IServices } from "@/types";
import fetchServices from "@/apiHelper/fetchServices";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useDispatch } from "react-redux";
import { addNotification } from "@/stores/reducers/notificationReducer";

const AllServices = () => {
  const dispatch = useDispatch();
  const [services, setServices] = useState<IServices[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const apiResult = await fetchServices({});

      if (apiResult.success === true) {
        const allServices = apiResult.data?.allServices;

        if (allServices && allServices.length > 0) {
          setServices(allServices);
          setLoading(false);
        } else {
          dispatch(
            addNotification({
              id: new Date().valueOf(),
              severity: "error",
              message: "Failed to fetch data",
              open: true,
            })
          );
        }
        setLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        dispatch(
          addNotification({
            id: new Date().valueOf(),
            severity: "error",
            message: "Failed to fetch data",
            open: true,
          })
        );
      }
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);
  return (
    <div>
      <div className="h-[20vh] bg-brand_bggray pt-16 text-center">
        <div className="text-[11px] uppercase">
          <Breadcrumbs />
        </div>
        <p className="text-3xl pt-4 font-bold">Services</p>
      </div>
      <div className="">
        <img className="w-full" src="/assets/images/layer2.png" />
      </div>
      <div className="bg-white pt-10 px-10 md:px-20">
        <div className="text-center">
          <p className="text-brand_text text-sm">
            Want it all from web design to SEO? Our talented team brings
            comprehensive digital services including branding, marketing,
            advertising and beyond.
          </p>
        </div>
        <div className="w-full py-16  flex flex-wrap ">
          {loading ? (
              <div className="flex justify-center items-center min-h-screen w-full">
                <div className="text-blue-500 ">
                  <CircularProgress color="inherit" size={20} />
                </div>
              </div>
            ) : !services || services.length < 1 ? (
              <p>No Services Found</p>
            ) : (
            services &&
            services.map((item) => <ServicesCard key={item?._id} item={item} refresh={()=>fetchAllServices()}/>)
          )}
        </div>
      </div>
    </div>
  );
};

export default AllServices;
