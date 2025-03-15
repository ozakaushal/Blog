import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

const Search = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    order: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    const sort = urlParams.get("order");
    const category = urlParams.get("category");
    if (searchTerm || sort || category) {
      setFilters({
        ...filters,
        searchTerm: searchTerm,
        category: category,
        order: sort,
      });
    }

    //fetch posts
    const fetchPosts = async () => {
      try {
        const searchQuery = urlParams.toString();
        setLoading(true);
        const res = await fetch(`/api/posts/all?${searchQuery}`);
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setPosts(data.post);
          if (data.post.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        toast("something went wrong!!", {
          type: "error",
        });
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setFilters({ ...filters, searchTerm: e.target.value });
    }
    if (e.target.id === "order") {
      const order = e.target.value || "desc";
      setFilters({ ...filters, order: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value;
      setFilters({ ...filters, category: category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", filters.searchTerm);
    urlParams.set("order", filters.order);
    urlParams.set("category", filters.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-5 border-b md:border-r md:min-h-screen border-gray-500 w-[500px] max-md:w-full">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Search term:</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={filters.searchTerm}
              onChange={handleChange}
              className="w-full p-2  rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Sort:</label>
            <Select
              value={filters.order}
              onChange={handleChange}
              id="order"
              className="w-full p-2  rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Category:</label>
            <Select
              value={filters.category}
              id="category"
              onChange={handleChange}
              className="w-full p-2 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="react">React.Js</option>
              <option value="next">Next.Js</option>
              <option value="uncategorized">Uncategorized</option>
            </Select>
          </div>
          <Button type="submit">Apply Filters</Button>
        </form>
      </div>
      {/* content */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 mt-5 px-6 py-2">
          Post results
        </h1>
        <div className="p-7 flex flex-wrap gap-4 justify-start">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gry-500 p-3">No posts found</p>
          )}
          {loading && <p>Loading ...</p>}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard post={post} key={post._id} />)}
        </div>
      </div>
    </div>
  );
};

export default Search;
