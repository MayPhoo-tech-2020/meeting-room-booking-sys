// lib/errorMessages.ts

export const getUserFriendlyErrorMessage = (err: any): string => {
  // Get the error from response
  const errorData = err?.response?.data;
  const errorMessage = errorData?.error || errorData?.message || err?.message || "";
  const status = err?.response?.status;

  // Map errors to user-friendly messages
  const errorMap: { [key: string]: string } = {
    // Booking errors
    "overlap": "📅 Oops! You already have a booking at this time. Please choose a different time slot.",
    "conflict": "📅 Oops! You already have a booking at this time. Please choose a different time slot.",
    "startTime must be before endTime": "⏰ The start time must be before the end time. Please adjust your booking times.",
    "before end time": "⏰ The start time must be before the end time. Please adjust your booking times.",
    
    // User errors
    "not found": "🔍 The item you're looking for could not be found. It may have been deleted.",
    "already exists": "📧 This email is already registered. Please use a different email.",
    
    // Permission errors
    "permission": "🔒 You don't have permission to perform this action. Please contact your admin.",
    "authorized": "🔒 You don't have permission to perform this action. Please contact your admin.",
    "only your own": "🔒 You can only delete your own bookings.",
    "only owner or admin": "🔒 This feature is only available for Owners and Admins.",
    
    // Validation errors
    "required": "⚠️ Please fill in all required fields before submitting.",
    "valid email": "📧 Please enter a valid email address.",
    "at least": "⚠️ Please check your input and try again.",
    
    // Default
    "default": "❌ Something went wrong. Please try again or contact support if the issue persists.",
  };

  // Check if any error message matches
  for (const [key, message] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return message;
    }
  }

  // Check by status code
  if (status === 400) return "⚠️ Please check your input and try again.";
  if (status === 401) return "🔒 Please login to continue.";
  if (status === 403) return "🔒 You don't have permission to do this.";
  if (status === 404) return "🔍 The item you're looking for could not be found.";
  if (status === 409) return "📅 This booking conflicts with another booking. Please choose a different time.";
  if (status === 500) return "❌ Something went wrong on our end. Please try again later.";

  // Default fallback
  return "❌ Something went wrong. Please try again.";
};