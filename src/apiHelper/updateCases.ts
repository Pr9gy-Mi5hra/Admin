
import axios from "axios"
import { ICases } from "@/types"



const UpdateCases = async(data:ICases)=> {
 try {
  let config = {
    headers: { Authorization: `Bearer ${data.token}` },
  };
   const response = await axios.post("/api/cases/update",data,config)

   if(response.status == 200){
   return {
    success:true,
    data:response.data
   }
   }else{
    return {success:false, message:"data update failed"}
   }
 } catch (error:any) {
    return {success:false, message:error.message}
 }
}

export default UpdateCases


 