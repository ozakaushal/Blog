import { Modal, Table, Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NoData from "./NoData";
import Loader from "./Loader";

const DashPosts = () => {
  const { currentUser, error } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const url = currentUser.isAdmin
          ? "/api/posts/all"
          : `/api/posts/all?userId=${currentUser._id}`;
        const res = await fetch(`${url}`);
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setUserPosts(data.post);
          if (data.post.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      setLoading(true);
      const startIndex = userPosts.length;
      const res = await fetch(
        `/api/posts/all?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setLoading(false);
        setUserPosts((prev) => [...prev, ...data.post]);
        if (data.post.length < 9) {
          setShowMore(false);
        }
        // console.log(userPosts);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    //postIdToDelete
    setShowModal(false);
    try {
      setLoading(true);
      const res = await fetch(
        `/api/posts/delete-post/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        toast(data.message, {
          type: "success",
        });
        setUserPosts((prev) => prev.filter((_) => _._id !== postIdToDelete));
        if (userPosts.length < 9) {
          setShowMore(false);
        }
      } else {
        setLoading(false);
        toast(data.message, {
          type: "error",
        });
        console.log(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast(error.message, {
        type: "error",
      });
      console.log(error);
    }
  };
  return loading ? (
    <Loader></Loader>
  ) : (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.postImage}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500"
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

          {showMore && (
            <button
              className="w-full text-teal-500 self-center py-7 text-lg hover:cursor-pointer"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <NoData></NoData>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"></HiOutlineExclamationCircle>
            <h3 className="mb-3 text-lg text-gray-400 dark:text-gray-200">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
