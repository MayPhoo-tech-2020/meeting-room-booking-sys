import axios from "axios";


export const getErrorMessage = (
  error: unknown,
  defaultMessage: string
): string => {


  if (!axios.isAxiosError(error)) {

    return defaultMessage;

  }




  const status =
    error.response?.status;



  switch(status) {


    case 400:

      return (
        error.response?.data?.error
        ||
        "Invalid request. Please check your input."
      );



    case 403:

      return (
        "You do not have permission to perform this action."
      );



    case 404:

      return (
        "The requested item was not found."
      );



    case 409:

      return (
        error.response?.data?.error
        ||
        "This action conflicts with existing data."
      );



    case 500:

      return (
        "Server error. Please try again later."
      );



    default:

      return defaultMessage;

  }


};