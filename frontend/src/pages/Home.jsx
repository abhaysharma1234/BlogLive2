import axios from "axios"
import Footer from "../components/Footer"
import HomePosts from "../components/HomePosts"
import Navbar from "../components/Navbar"
import { IF, URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"
 

const Home = () => {
  
  const {search}=useLocation()
  // console.log(search)
  const [posts,setPosts]=useState([])
  const [noResults,setNoResults]=useState(false)
  const [loader,setLoader]=useState(false)
  const {user}=useContext(UserContext)
  const userData = localStorage.getItem("user");  // Retrieve the data
console.log(userData); 

  const fetchPosts=async()=>{
    setLoader(true)
    try{
      const res=await axios.get(URL+"/api/posts/"+search)
      // console.log(res.data)
      setPosts(res.data)
      if(res.data.length===0){
        setNoResults(true)
      }
      else{
        setNoResults(false)
      }
      setLoader(false)
      
    }
    catch(err){
      console.log(err)
      setLoader(true)
    }
  }

  useEffect(()=>{
    fetchPosts()

  },[search])



  return (
    
    <>
    <Navbar/>
    
    <div className="px-8 md:px-[200px] min-h-[80vh] bg-gray-50 mt-6">
  {loader ? (
    <div className="h-[40vh] flex justify-center items-center">
      <Loader />
    </div>
  ) : !noResults ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {posts.map((post) => (
        <Link to={user ? `/posts/post/${post._id}` : "/login"} key={post._id}>
          <div className="w-full h-full flex flex-col bg-white border rounded-md shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
            <div className="h-[200px] flex justify-center items-center">
              <img
                src={IF + post.photo}
                alt={post.title}
                className="h-full w-full object-cover rounded-t-md"
              />
            </div>
            <div className="flex flex-col p-4">
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                {post.title}
              </h2>

              {/* Username and Date/Time */}
              <div className="text-sm text-gray-500 mb-3">
                <p>@{post.username}</p>
                <p>{new Date(post.updatedAt).toLocaleDateString()} {new Date(post.updatedAt).toLocaleTimeString()}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {post.desc}
              </p>

              {/* Read more link */}
              <div className="text-sm text-blue-600">
                Read more
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <h3 className="text-center font-bold mt-16 text-lg text-gray-700">
      No posts available
    </h3>
  )}
</div>


    <Footer/>
    </>
    
  )
}

export default Home