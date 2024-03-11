
import axios from "axios"

interface Iform {
    title:string,
    year:string,
    timeframe:string,
    main_service:string,
    extra_service:string,
    return_on_investment:string,
    description:string,
    cover_image:string,
    token: string
}

const AddCases = async(data:Iform)=> {
 try {
  let config = {
    headers: { Authorization: `Bearer ${data.token}` },
  };
   const response = await axios.post("/api/cases/add",data, config)

   if(response.status == 200){
   return {
    success:true,
    data:response.data
   }
   }else{
    return {success:false, message:"data submission failed"}
   }
 } catch (error:any) {
    return {success:false, message:error.message}
 }
}

export default AddCases


 