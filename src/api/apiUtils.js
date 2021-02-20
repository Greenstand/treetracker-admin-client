import {session} from "../models/auth";

export async function handleResponse(response) {
  if (response.status === 204) return {};
  if (response.ok) return response.json();
  if (response.status === 400) {
    // server-side validation error occurred.
    // Server side validation returns a string error message, so parse as text instead of json.
    const error = await response.text();
    throw new Error(error);
  }
  throw new Error("Network response was not ok.");
}

// we should call an error logging service, but
export function handleError(error) {
  // eslint-disable-next-line no-console
  console.error("API call failed. " + error);
  throw error;
}

export function getOrganization(){
  if(session.user?.policy?.organization?.id){
    return `organization/${session.user?.policy?.organization?.id}/`;
  }else{
    return "";
  }
}

