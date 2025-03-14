import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Textarea, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({ comment, onLike, onEdit, onDeleteComment }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        if (res) {
          const data = await res.json();
          if (res.ok) {
            setUser(data);
          } else {
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = async () => {
    try {
      setIsEditing(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center gap-2 my-3 dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user && user.userPhoto}
          alt={user && user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-3">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {!isEditing ? (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center border-t border-gray-300 dark:border-gray-700 max-w-fit gap-2 pt-2">
              <button
                className={` cursor-pointer flex items-center gap-2`}
                type="button"
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp
                  className={`${
                    currentUser && comment.likes.indexOf(currentUser._id) !== -1
                      ? "text-blue-500"
                      : "text-gray-400"
                  }  hover:text-blue-500 cursor-pointer flex items-center gap-2 text-sm`}
                ></FaThumbsUp>
                <span className="text-gray-400">
                  {comment.noOfLikes} {comment.noOfLikes > 1 ? "Likes" : "Like"}
                </span>
              </button>
              {/* Edit comments */}
              {(currentUser && currentUser.isAdmin) ||
              comment.likes.indexOf(currentUser._id) !== -1 ? (
                <button
                  type="button"
                  className="text-gray-400 hover:text-blue-500"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              ) : null}
              {(currentUser && currentUser.isAdmin) ||
              comment.likes.indexOf(currentUser._id) !== -1 ? (
                <button
                  type="button"
                  className="text-gray-400 hover:text-blue-500"
                  onClick={() => setShowModal(true)}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <Textarea
              rows={3}
              value={editedComment}
              maxLength={200}
              onChange={(e) => setEditedComment(e.target.value)}
              className="outline-none border-teal-100 px-3 py-2"
            ></Textarea>
            <div className="flex items-center gap-2 w-full mt-3">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  setIsEditing(false);
                  onEdit(comment, editedComment);
                }}
                outline
                className="hover:text-black dark:hover:text-white cursor-pointer"
              >
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                className="dark:hover:text-white cursor-pointer"
                onClick={() => {
                  setIsEditing(false);
                  setEditedComment(comment.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => onDeleteComment(comment._id)}
              >
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

export default Comment;
