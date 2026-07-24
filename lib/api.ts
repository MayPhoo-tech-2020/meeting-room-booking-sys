import axios from "axios";



const api = axios.create({

  baseURL:
    "https://meeting-room-booking-sys-ten.vercel.app",

  headers: {

    "Content-Type":
      "application/json",

  },

});









export const getStoredUser = () => {


  if(typeof window === "undefined") {

    return null;

  }



  const data =
    localStorage.getItem(
      "currentUser"
    );



  if(!data){

    return null;

  }



  try {


    return JSON.parse(data);


  } catch(error) {


    return null;


  }


};









export const getStoredRole = ():string => {


  const user =
    getStoredUser();



  if(user?.role){

    return user.role;

  }



  return "USER";


};









export const getStoredUserId = ():string => {


  const user =
    getStoredUser();



  if(user?.id){

    return user.id;

  }



  return "";


};









export const getAuthHeaders = (

  role?:string,

  userId?:string

) => {


  const currentUser =
    getStoredUser();



  const headers:
    Record<string,string>
    = {

      "x-user-role":
        role
        ||
        currentUser?.role
        ||
        "USER",

    };





  const id =
    userId
    ||
    currentUser?.id;



  if(id){


    headers["x-user-id"] =
      id;


  }




  return headers;


};









export default api;