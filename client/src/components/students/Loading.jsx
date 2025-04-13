import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Loading = () => {

  const {path} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if(path){
      const timer = setTimeout(() => {
        navigate(`/${path}`)
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  })
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce200"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce400"></div>
      </div>
    </div>
  );
};

export default Loading;
