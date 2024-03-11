
import axios from "axios"

interface ISLug{
  slug?:string,
  page?: number,
  limit?: number
}

const fetchCases = async(props:ISLug)=> {
 try {
  console.log('inside fetchCases')
   const response = await axios.get("/api/cases",{params:{
    slug: props.slug,
    _start: ((props.limit||6)*(props.page||1)-(props.limit||6)),
    _limit: props.limit
   }})
   console.log(response.data, 'response')



   if(response.status == 200){
   return {
    success:true,
    data:response.data
   }
   }else{
    return {success:false, message:"data not available"}
   }
   console.log(response.data,'response')
 } catch (error:any) {
    return {success:false, message:error.message}
 }
}

export default fetchCases


 