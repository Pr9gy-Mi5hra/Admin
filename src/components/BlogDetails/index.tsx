"use client";
import AddComment from "@/apiHelper/addComment";
import fetchBlogs from "@/apiHelper/fetchBlog";
import fetchComments from "@/apiHelper/fetchComments";
import { addNotification } from "@/stores/reducers/notificationReducer";
import { IBlogs, ICategories, IComments } from "@/types";
import moment from "moment";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../Comment";
import { comment } from "postcss";
import Breadcrumbs from "../Breadcrumbs";
import UpdateBlog from "@/apiHelper/updateBlog";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Modal } from "@mui/material";
import { RiCloseFill } from "react-icons/ri";
import ReactQuill from "react-quill";

const BlogDetails = ({
  data,
  setCommentAdded,
  refresh
}: {
  data: IBlogs;
  setCommentAdded: any;
  refresh:()=>void
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [recentPost, setRecentPost] = useState<IBlogs[] | null>(null);
  const [recentComments, setRecentComments] = useState<IComments[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [blogComments, setBlogComments] = useState<IComments[] | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [short_description, setShortDescription] = useState(
    data.short_description
  );
  const [long_description, setLongDescription] = useState(
    data.long_description
  );
  const [loading, setLoading] = useState(false);
  const [cover_image, setCoverImage] = useState(data.cover_image);
  const [blogCategory, setBlogCategory] = useState(data.category);
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState(data.slug);
  const user = useSelector((state: any) => state.general.user);
  const [categories, setCategories] = useState<ICategories[] | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async () => {
    if (data._id) {
      setSubmitLoading(true);
      const response = await AddComment({
        blog: data?._id,
        name: name,
        message: message,
      });
      console.log(response, "response");
      if (response.success === true) {
        dispatch(
          addNotification({
            id: new Date().valueOf(),
            message: "Comment added successfully",
            open: true,
            severity: "success",
          })
        );
        setSubmitLoading(false);
        setCommentAdded(true);
        setName("");
        setMessage("");
        fetchBlogComments();
      } else {
        dispatch(
          addNotification({
            id: new Date().valueOf(),
            message: "Comment submission failed",
            open: true,
            severity: "error",
          })
        );
      }
    }
  };

  const fetchRecentBlogs = async () => {
    try {
      const apiResult = await fetchBlogs({
        limit: 3,
      });

      if (apiResult.success === true) {
        const allRecentBlogs = apiResult.data?.allBlogs;

        if (allRecentBlogs && allRecentBlogs.length > 0) {
          setRecentPost(allRecentBlogs);
        } else {
          setError("No Blogs found.");
        }
      } else {
        setError("Error fetching data: " + apiResult.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const fetchRecentComments = async () => {
    try {
      const apiResult = await fetchComments({
        limit: 3,
      });

      if (apiResult.success === true) {
        const allRecentComments = apiResult.data?.allComments;

        if (allRecentComments && allRecentComments.length > 0) {
          setRecentComments(allRecentComments);
        } else {
          setError("No Comments found.");
        }
      } else {
        setError("Error fetching data: " + apiResult.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const fetchBlogComments = async () => {
    try {
      const apiResult = await fetchComments({ blog: data._id });
      if (apiResult.success === true) {
        const response = apiResult.data?.allComments;
        if (response && response.length > 0) {
          setBlogComments(response);
        } else {
        }
      } else {
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        dispatch(
          addNotification({
            id: new Date().valueOf(),
            message: " failed to fetch details",
            open: true,
            severity: "error",
          })
        );
      }
    }
  };

  const handleUpdate = async (_id: string) => {
    setLoading(true);
    const response = await UpdateBlog({
      _id,
      title: title,
      slug: slug,
      short_description: short_description,
      long_description: long_description,
      cover_image: cover_image,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: " Blog Updated successfully",
          open: true,
          severity: "success",
        })
      );
      setLoading(false);
      router.push("/all-blogs");
      setTitle("");
      setSlug("");
      setCoverImage("");
      setLongDescription("");
      setShortDescription("");
      setSlug("");
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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  console.log(blogComments, "blogComments");

  useEffect(() => {
    fetchBlogComments();
    fetchRecentBlogs();
    fetchRecentComments();
  }, []);

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  }

  return (
    <div className=" ">
      <div className="h-auto bg-brand_bggray pb-16 pt-16 text-center ">
        <div className="text-[11px] uppercase">
          <Breadcrumbs />
        </div>
        <p className=" px-10 pb-4  lg:text-3xl bg-brand_bggray pt-3 font-semibold">
          {data.title}
        </p>
      </div>
      <div className="pt-5 hidden md:block md:pt-0">
        <img className="w-full" src="/assets/images/layer2.png" />
      </div>
      <div className="flex  flex-wrap py-10 lg:px-20 px-10 justify-start">
        <div className="pt-5 lg:pt-0 lg:w-9/12 lg:pr-3 w-full">
          <div>
            <img src={data.cover_image} />
          </div>
          <div className="text-[10px] xl:text-[12px] pt-2 text-brand_text flex  ">
            <div className="border-r-2 pr-3 border-r-brand_text">
              {" "}
              <p className="">
                {moment(data.created_at).format("MMMM DD YYYY")}
              </p>
            </div>
            <div className="border-r-2 px-3 border-r-brand_text">
              <p>{data.created_by?.name}</p>
            </div>
            <div className="hidden xl:block border-r-2 px-3 border-r-brand_text">
              <p>{data.category.name}</p>
            </div>
            <div className="hidden xl:block  px-3 ">
              <p>{data.comments?.length} Comments</p>
            </div>
          </div>
          <div
            className="pt-6 text-sm text-brand_text"
            dangerouslySetInnerHTML={{ __html: data.long_description } as any}
          ></div>
          <div>
            <div className="pt-6">
              <button
                onClick={() => setOpenModal(true)}
                className="px-4 py-2 bg-brand_secondary text-white text-sm "
              >
                Update
              </button>
            </div>
          </div>
          <div className="pt-4">
            <div>
              <div> Comments ({data.comments?.length})</div>
            </div>
            <div className="pt-4">
              
              {blogComments && blogComments.length > 0 && (
                <Comment
                  comments={blogComments}
                  fetchBlogComments={fetchBlogComments}
                />
              )}
            </div>
          </div>
          <div className="pt-6">
            <div>
              <p>Leave a comment</p>
            </div>
            <div className="pt-4 rounded-md ">
              <div className="bg-brand_lightgray rounded-lg p-6">
                <div className="">
                  <div className="pt-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                  <div className="pt-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => handleSubmit()}
                      className="px-4 rounded-md text-white py-2 bg-brand_secondary"
                    >
                      {submitLoading ? (
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
            </div>
          </div>
        </div>
        <div className="w-full lg:pl-3 lg:w-3/12 ">
          <div className="py-6">
            <p className="text-md font-semibold">About The Blog</p>
            <p className=" pt-2 text-[13px] text-brand_text">
              {data.short_description}
            </p>
          </div>
          <div className="py-6 border-b ">
            <p className="text-md font-semibold">Recent Posts</p>
            <div className="py-4">
              {recentPost &&
                recentPost.length > 0 &&
                recentPost.map((item) => (
                  <Link shallow href={`/all-blogs/${item.slug}`} key={item._id}>
                    <div className="py-2 hover:text-brand_secondary">
                      <p className="text-[10px] text-brand_text">
                        {" "}
                        {moment(item.created_at).format("MMMM DD YYYY")}
                      </p>
                      <p className="text-sm">{item.title}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <div className="py-6 border-b ">
            <p className="text-md font-semibold">Recent Comments</p>
            <div className="py-4">
              {recentComments &&
                recentComments.length > 0 &&
                recentComments.map((item) => (
                  <div
                    key={item._id}
                    className="flex py-2 items-center space-x-1"
                  >
                    <p className="text-[10px] text-black">
                      {">"}
                      {truncateText(item.name, 5)} on
                    </p>
                    <Link shallow href={`/all-blogs/${item.blog?.slug}`}>
                      <p className="text-sm text-brand_secondary">
                        {truncateText(item.blog?.title, 20)}
                      </p>
                    </Link>
                  </div>
                ))}
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
            <div className="w-full   overflow-auto">
              <div className="z-10 absolute cursor-pointer top-5 text-2xl  text-brand_secondary right-5">
                <RiCloseFill onClick={handleCloseModal} />
              </div>

              <div className="text-black">
                <div className="pt-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="pt-4">
                  <label
                    htmlFor="short_description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Short Description
                  </label>
                  <textarea
                    id="short_description"
                    value={short_description}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <label
                    htmlFor="long_description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Long Description
                  </label>
                  <ReactQuill
                    theme="snow"
                    className="text-black"
                    value={long_description}
                    onChange={setLongDescription}
                  />
                </div>

                <div className="pt-4">
                  <label
                    htmlFor="cover_image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    id="cover_image"
                    value={cover_image}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div>
                  <button
                    onClick={() => data._id && handleUpdate(data._id)}
                    className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default BlogDetails;
