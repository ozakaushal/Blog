import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  imageUploadEnd,
  imageUploadStart,
  newPostStart,
  newPostSuccess,
  newPostFailure,
} from "../redux/post/postSlice";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.post);
  const { currentUser } = useSelector((state) => state.user);
  const [postImage, setPostImage] = useState(null);
  const [postImageUrl, setPostImageURL] = useState("");
  const [postData, setPostData] = useState(null);

  const navigate = useNavigate();
  const { postId } = useParams();
  const handlePostImageChange = (e) => {
    const files = e.target.files;
    if (files[0]) {
      setPostImage(files[0]);
      setPostImageURL(URL.createObjectURL(files[0]));
    }
  };

  const handleFormInput = async (e) => {
    // do something
    if (e.target.id === "title" || e.target.id === "category") {
      setPostData({ ...postData, [e.target.id]: e.target.value });
    }
  };

  const handleUploadImage = async () => {
    try {
      if (postImage) {
        dispatch(imageUploadStart());
        const formData = new FormData();
        formData.append("postImage", postImage);

        const res = await fetch("/api/posts/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          dispatch(imageUploadEnd());
          toast("Image has been uploaded");
          const data = await res.json();
          if (data) {
            setPostData({ ...postData, postImage: data.url });
          }
        } else {
          toast("Error uploading the image to our servers", { type: "error" });
          dispatch(imageUploadEnd());
        }
      } else {
        toast("Kindly select an image");
        dispatch(imageUploadEnd());
      }
    } catch (error) {
      console.log(error);
      dispatch(imageUploadEnd());
    }
  };

  const handlePostPublish = async (e) => {
    e.preventDefault();
    console.log(postData);
    try {
      dispatch(newPostStart());
      const res = await fetch(
        `/api/posts/update-post/${postData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(newPostSuccess());
        toast("Post has been updated", {
          type: "success",
        });
        setPostData(null);
        // navigate to specific post
        navigate(`/post/${data.slug}`);
      } else {
        dispatch(newPostFailure(data.message));
        toast(data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      dispatch(newPostFailure(error));
      toast("issue with upating the post", { type: "error" });
    }
  };

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/posts/all?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          toast(data.message, {
            type: "error",
          });
        } else {
          setPostData(data.post[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      {error && (
        <Alert className="mt-5" color="failure">
          {error}
        </Alert>
      )}
      <form
        className="flex flex-col gap-4 mt-5"
        onInput={handleFormInput}
        onSubmit={handlePostPublish}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            value={postData?.title}
            id="title"
            className="flex-1"
          ></TextInput>
          <Select id="category" value={postData?.category}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React.Js</option>
            <option value="next">Next.Js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-4">
          <FileInput
            accept="image/*"
            onChange={handlePostImageChange}
          ></FileInput>
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleUploadImage}
            outline
          >
            {!loading ? "Upload image" : "Please wait ..."}
          </Button>
        </div>
        {(postImageUrl || postData) && (
          <img
            src={postImageUrl || postData?.postImage}
            alt="post-image"
            height="auto"
            width="100%"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="write something creative ..."
          className="h-72 mb-12"
          id="content"
          value={postData?.content}
          onChange={(value) => {
            setPostData({ ...postData, content: value });
          }}
          required
        />
        <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
