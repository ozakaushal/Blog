import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full border h-[380px] overflow-hidden sm:w-[430px] rounded-lg transition-all duration-300">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.postImage}
          alt="post-cover"
          className="h-[260px] w-full object-cover transition-all duration-300 group-hover:h-[200px] group-hover:scale-105"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 bg-white">
        <p className="text-lg font-bold line-clamp-2">{post.title}</p>
        <span className="italic text-sm text-gray-500">{post.category}</span>
      </div>
      <Link
        to={`/post/${post.slug}`}
        className="z-10 p-3 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border-teal-500 text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 text-center my-3 rounded-md !rounded-tl-none m-2"
      >
        Read Article
      </Link>
    </div>
  );
};

export default PostCard;
