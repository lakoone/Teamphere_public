import { axiosInstance } from "@/utils/axios-config"

export const acceptRequests = async(requestIDs:number[])=>{
  return await axiosInstance.post('/api/user/acceptRequest',{requestsID:requestIDs})
}
export const rejectRequests = async(requestIDs:number[])=>{
    return await axiosInstance.post('/api/user/rejectRequest',{requestsID:requestIDs})
  }
  export const fetchUsersData = async(IDs:number[],take:number)=>{
    return await axiosInstance.post('/api/user/publicUsers', {
        take,
        IDs:Array.from(IDs)
      });
  }