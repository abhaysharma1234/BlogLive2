import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { useContext, useState } from "react"
import axios from "axios"
import { URL } from "../url"
import { UserContext } from "../context/UserContext"




const Forgot = () => {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [verificationCode, setVerificationCode] = useState('');
  const [error,setError]=useState(false)
  const [message,setMessage] = useState(false)
  const {setUser}=useContext(UserContext)
  const navigate=useNavigate()

  const sendVerificationCode = async () => {
    try {
      const res = await axios.post(URL + "/api/auth/sendverificationcode", { email });
      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
      setVerificationCode();
      setMessage(error.response?.data.message || "Error sending verification code.");
    }
  };

  const verifyCodeAndResetPassword = async (e) => {
    e.preventDefault();
    setError(false);
    setMessage("");
    try {
       const res =  await axios.post(URL + "/api/auth/verify-code", { email, code: verificationCode, password });
      // Assuming you display a success message or redirect after this
      console.log(res.data);
     setEmail("");
     setPassword("");
     setVerificationCode("");
     setMessage(res.data.message);
    } catch (err) {
      setError(true);
      setMessage(err.response?.data.message || "An error occurred while updating your password.");
      console.log(err);
    }
  };
return (
    <>
    <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
    <h1 className="text-lg md:text-xl font-extrabold"><Link to="/">Blog Live</Link></h1>
    <div className="flex justify-end space-x-4">
    <h3><Link to="/login">Login</Link></h3>
    <h3><Link to="/register">Register</Link></h3>
    </div>
    </div>
<div className="w-full flex justify-center items-center h-[80vh] ">
       <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
         <h1 className="text-xl font-bold text-left">Create your new password</h1>
         <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-2 border-2 border-black outline-0" type="text" placeholder="Enter your email" />
         <input  value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-2 border-2 border-black outline-0" type="password" placeholder="Enter your new password" />
         <input  value={verificationCode}  onChange={(e) => setVerificationCode(e.target.value)} className="w-full px-4 py-2 border-2 border-black outline-0" type="text" placeholder="Enter your code" />
         <button onClick={verifyCodeAndResetPassword} className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black ">Change password</button>
         {message && (
    <h3 className={error ? "text-red-500 text-sm" : "text-green-500 text-sm"}>
      {message}
    </h3>
  )}
         <div className="flex justify-center items-center space-x-3">
          <p>New here?</p>
          <p className="text-gray-500 hover:text-black"><Link to="/register">Register</Link></p>
          <button onClick={sendVerificationCode} className="text-gray-500 hover:text-black">Send Verification Code</button>
         </div>
       </div>
    </div>
    <Footer/>
    </>
    
  )
}

export default Forgot