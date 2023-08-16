"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BlogDataCard from "./BlogDataCard";

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

export const AllBlog = () => {
  const [blogData, setBlogData] = useState<BlogItem[]>([]);

  // useEffect(() => {
  async function fetchBlogData() {
    try {
      const res = await axios.get("https://blog-zlon.onrender.com/blog");
      setBlogData(res.data);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message);
    }
  }
  fetchBlogData();
  // }, []);

  return (
    <div className="flex flex-col gap-4">
      {blogData.map((item: BlogItem) => (
        <BlogDataCard key={item._id} data={item} />
      ))}
    </div>
  );
};
