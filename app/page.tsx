"use client";
import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { AllBlog } from "@/components/Data";
import AdvertCard from "@/components/AdvertCard";
import Users from "@/components/Users";
import BlogCard from "@/components/blogCard";
import axios from "axios";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { isLoggedIn, setAllBlog } from "@/store/slice";
import { useRouter } from "next/navigation";
import Profile from "@/components/Profile";

type BlogItem = {
  _id: string;
  _v: number;
  userId: string;
  userName: string;
  title: string;
  image: { url: string; fileId: string };
  description: string;
  comments: { userName: string; comment: string }[];
};

export default function Home() {
  // const [blogData, setBlogData] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLogin = useSelector(isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();
  const allBlog: BlogItem[] = useSelector(
    (state: any) => state.counter.allBlog
  );

  if (!isLogin) {
    router.push("/login");
  }

  useEffect(() => {
    async function fetchBlogData() {
      try {
        setIsLoading(true);
        const res = await axios.get("https://blog-zlon.onrender.com/blog");
        // setBlogData(res.data);
        dispatch(setAllBlog(res.data));
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        toast.error(error?.message);
      }
    }
    if (allBlog.length === 0) {
      fetchBlogData();
    }
  }, []);

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-around gap-8 relative">
      <Profile />
      <div className="flex flex-col w-full lg:w-1/2 gap-10 pb-10">
        {/* <Suspense fallback={<Loading />}>
          <AllBlog />
        </Suspense> */}
        {isLoading ? (
          <div className="flex w-full justify-center">
            <FadeLoader loading={isLoading} color="#0070f0" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {allBlog
              .slice()
              ?.reverse()
              ?.map((item) => (
                <BlogCard key={item._id} data={item} />
              ))}
          </div>
        )}
      </div>
      <div className="hidden lg:flex flex-col w-full lg:w-[30%] gap-5 h-fit lg:sticky top-[130px]">
        <AdvertCard />
        <Users />
      </div>
    </div>
  );
}

// function Loading() {
//   return (
//     <div className="flex flex-col gap-4">
//       {Array.from({ length: 4 }).map((_, index) => (
//         <BlogCard key={index} />
//       ))}
//     </div>
//   );
// }
