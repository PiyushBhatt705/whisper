import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

const API_URL = "https://whisper-uyi4.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json", 
  },
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptors = api.interceptors.request.use(async (config) => {
      const tocken = await getToken();

      if (tocken) {
        config.headers.Authorization = `Bearer ${tocken}`;
      }
      return config;
    })


    const resposneInterceptor = api.interceptors.response.use((response) => response, (error) =>{
      //log api error to senatry
      if(error.response){
        
      } else if(error.request){}
    })

    return () => {
      api.interceptors.request.eject(requestInterceptors)
    }
  }, [getToken]);
  return api
};
