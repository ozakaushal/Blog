import { Button, Textarea, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Comment from "./Comment";
import { editComment } from "../../../api/controllers/comment.controller";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState(null);

  const onCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comment.length > 200) {
        toast("comment should be of maximum 200 characters", {
          type: "error",
        });
        return;
      }

      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      if (res) {
        const data = await res.json();
        if (!res.ok) {
          toast("unable to publish the comment", { type: "error" });
          return;
        }
        // comment published
        if (data.success) {
          setComment("");
          setPostComments([data.comment, ...postComments]);
        }
      }
    } catch (error) {
      console.log(error);
      toast("something went wrong and we could not complete your request", {
        type: "error",
      });
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        useNavigate("/sign-in");
        toast("You need to sign in in order to engage to a post", {
          type: "info",
        });
        return;
      }
      const res = await fetch(`/api/comment/like/${commentId}`, {
        method: "PUT",
      });
      console.log(res);
      if (res) {
        const data = await res.json();
        if (res.ok) {
          setPostComments((postComments) =>
            postComments.map((comment) =>
              comment._id === commentId
                ? { ...comment, likes: data.likes, noOfLikes: data.noOfLikes }
                : comment
            )
          );
        } else {
          toast("server error.. please try again", {
            type: "error",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get/${postId}`);
        if (res) {
          const data = await res.json();
          if (res.ok) {
            setPostComments(data.comments);
          } else {
            toast("unable to fetch the comments for this post", {
              type: "error",
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleEditComment = async (comment, editedContent) => {
    try {
      const res = await fetch(`/api/comment/update/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res) {
        if (res.ok) {
          const data = await res.json();
          toast("comment updated", {
            type: "success",
          });
          setPostComments((comments) =>
            comments.map((item) =>
              item._id === comment._id
                ? { ...item, content: data.content }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/delete/${commentId}`, {
        method: "DELETE",
      });
      if (res) {
        if (res.ok) {
          const data = await res.json();
          toast(data.message, {
            type: "success",
          });
          setPostComments((comments) =>
            comments.filter((item) => item._id !== commentId)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full mx-auto p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            src={currentUser.userPhoto}
            alt=""
            className="h-5 w-5 rounded-full object-cover"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-600 my-5 flex gap-1">
          You must be logged in to comment on this post
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      )}
      {/* comment section starts */}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={onCommentSubmit}
        >
          <Textarea
            placeholder="Add a comment"
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            value={comment}
            maxLength={200}
            className="outline-none border-teal-100 px-3 py-2"
          ></Textarea>
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - (comment ? comment.length : 0)} characters left
            </p>
            <Button
              outline
              gradientDuoTone=""
              className="hover:text-black cursor-pointer"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      )}
      {/* displaying comments */}
      {postComments ? (
        <>
          <div className="flex text-sm my-5 items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{postComments.length}</p>
            </div>
          </div>
          {postComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEditComment}
              onDeleteComment={handleCommentDelete}
            ></Comment>
          ))}
        </>
      ) : (
        <p className="text-sm my-5">Be the first one to comment</p>
      )}
      {/* comment section end */}
    </div>
  );
};

export default CommentSection;
