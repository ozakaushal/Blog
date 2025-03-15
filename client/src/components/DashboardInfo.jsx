import React, { useEffect, useState } from "react";
import { HiArrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HiAnnotation } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Button, Table } from "flowbite-react";

const DashboardInfo = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [dashInfo, setDashInfo] = useState();
  useEffect(() => {
    const fetchDashInfo = async () => {
      const res = await fetch(`/api/dashboard/get-info`);
      if (res) {
        const data = await res.json();
        if (res.ok) {
          setDashInfo({ ...data });
          //console.log(dashInfo);
        } else {
          toast("Unable to fetch the data, please try again later", {
            type: "error",
          });
        }
      }
    };
    fetchDashInfo();
  }, [currentUser]);
  return (
    <div className="p-3 px-5 md:mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 justify-center px-3">
        {currentUser && currentUser.isAdmin && (
          <div className="flex flex-col flex-1 p-3 dark:bg-slate-800 gap-4 md:w-50 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                <p className="text-2xl">{dashInfo && dashInfo.totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg"></HiOutlineUserGroup>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-green-500 flex items-center">
                {<HiArrowUp></HiArrowUp>}
                {dashInfo && dashInfo.lastMonthsUsers}
              </span>
              <div className="text-gray-500">Last Months</div>
            </div>
          </div>
        )}
        <div className="flex flex-col flex-1 p-3 dark:bg-slate-800 gap-4 md:w-50 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{dashInfo && dashInfo.totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg"></HiAnnotation>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-green-500 flex items-center">
              {<HiArrowUp></HiArrowUp>}
              {dashInfo && dashInfo.lastMonthComments}
            </span>
            <div className="text-gray-500">Last Months</div>
          </div>
        </div>
        <div className="flex flex-col flex-1 p-3 dark:bg-slate-800 gap-4 md:w-50 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{dashInfo && dashInfo.totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg"></HiDocumentText>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-green-500 flex items-center">
              {<HiArrowUp></HiArrowUp>}
              {dashInfo && dashInfo.lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Months</div>
          </div>
        </div>
      </div>
      {/* tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 py-3 px-3 w-full mx-auto gap-4 justify-center">
        {currentUser && currentUser.isAdmin && (
          <div className="flex flex-col md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Users</h1>
              <Button outline gradientDuoTone="purpleToPink">
                <Link to="/dashboard?tab=users">See all</Link>
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {dashInfo && dashInfo.users.length > 0 ? (
                  dashInfo.users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        <img
                          src={user.userPhoto}
                          alt="user"
                          className="w-10 h-10 rounded-full object-cover bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan="2" className="text-center">
                      No data available
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}

        <div className="flex flex-col md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=comments">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {dashInfo && dashInfo.comments.length > 0 ? (
                dashInfo.comments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/profile/${comment.userId}`}>
                        {comment.userId}
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan="2" className="text-center">
                    No data available
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
        <div className="flex flex-col w-full shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Posted by</Table.HeadCell>
              <Table.HeadCell>Posted category</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {dashInfo && dashInfo.posts.length > 0 ? (
                dashInfo.posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="w-95">
                      <img
                        src={post.postImage}
                        alt="user"
                        className="w-40 h-20 rounded-md object-cover bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-95">
                      <Link to={`/post/${post.slug}`}>
                        <p className="line-clamp-2">{post.title}</p>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/profile/${post.userId}`}>{post.userId}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{post.category}</p>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan="2" className="text-center">
                    No data available
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardInfo;
