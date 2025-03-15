import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import { HiArrowCircleRight } from "react-icons/hi";

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/all?limit=9$sort=desc`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.post);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-3 p-25 px-3 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores
          hic dicta vel modi.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 text-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700 max-w-7xl mx-auto">
        <CallToAction></CallToAction>
      </div>
      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl mt-5 font-semibold text-center">
              Recent Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-x-18 mt-8">
              {posts.map((post) => (
                <PostCard post={post} key={post._id} />
              ))}
            </div>
            <div className="text-center flex gap-2 items-center text-lg justify-center group">
              <Link
                to="/search"
                className="text-violet-700 text-bold hover:underline"
              >
                view all posts
              </Link>
              <HiArrowCircleRight className="text-violet-700 group-hover:translate-x-2 transition-all duration-300"></HiArrowCircleRight>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
