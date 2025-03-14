import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/posts/all?slug=${slug}`);
        if (res) {
          const data = await res.json();
          if (res.ok) {
            setLoading(false);
            setPost(data.post[0]);
          } else {
            toast("Unable to fetch the data !!", {
              type: "error",
            });
            setError(true);
            setLoading(false);
            return;
          }
        }
      } catch (error) {}
    };
    fetchPosts();
  }, [slug]);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch(`/api/posts/all?order=desc&limit=3`);
        if (res) {
          const data = await res.json();
          if (res.ok) {
            setRecentPosts(data.post);
          }
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl"></Spinner>
      </div>
    );
  else {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post && post.title}
        </h1>
        <Link
          className="self-center mt-5"
          to={`/search?category=${post && post.category}`}
        >
          <Button color="gray" pill size="xs">
            {post && post.category}
          </Button>
        </Link>
        <img
          src={post && post.postImage}
          alt={post && post.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
        <div className="flex justify-between px-5 py-3 border-b border-slate-500 mx-auto w-full text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 mx-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <div className="mx-auto w-full">
          <CallToAction></CallToAction>
        </div>
        <CommentSection postId={post._id}></CommentSection>
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-3xl mt-5 mb-3">Recent Articles</h1>
          <div className="flex gap-2 w-full mt-3 max-md:flex-col">
            {recentPosts &&
              recentPosts
                .filter((item) => item._id !== post._id)
                .map((recentPost) => (
                  <PostCard key={recentPost._id} post={recentPost}></PostCard>
                ))}
          </div>
        </div>
      </main>
    );
  }
};

export default PostPage;
