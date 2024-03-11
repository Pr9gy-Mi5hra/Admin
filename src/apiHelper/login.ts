import axios from "axios";

interface loginUser {
   email:string,
   password:string
}

export default async function LoginHelper(data: loginUser) {
  try {
    if (!data.email || !data.password ) {
      throw Error("Missing Fields");
    }
      const response = await axios.post("/api/login", data);

    if (response.status == 200 && response.data?.token) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    return { success: false, message: error.response.data.message };
  }
}