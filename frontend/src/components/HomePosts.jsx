/* eslint-disable react/prop-types */
import {IF} from '../url'


const HomePosts = ({ post }) => {
  return (
    <div className="w-full flex bg-white border rounded-md shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out">
      {/* Left: Image section */}
      <div className="w-[40%] h-[200px] md:h-[250px] flex justify-center items-center p-2">
        <img src={IF + post.photo} alt={post.title} className="h-full w-full object-cover rounded-md" />
      </div>
      
      {/* Right: Details section */}
      <div className="flex flex-col w-[60%] p-4">
        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-900 mb-2 truncate">{post.title}</h1>
        
        {/* Username & Timestamp */}
        <div className="flex mb-2 text-sm text-gray-500 items-center justify-between">
          <p>@{post.username}</p>
          <div className="flex space-x-2 text-xs">
            <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
            <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
          </div>
        </div>
        
        {/* Description (truncated) */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {post.desc}
        </p>

        {/* Read More Link */}
        <a href="#" className="text-blue-600 text-xs font-medium">Read more</a>
      </div>
    </div>
  );
};


export default HomePosts

