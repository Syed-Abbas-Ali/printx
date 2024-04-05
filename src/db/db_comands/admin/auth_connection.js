// import Admin from '../model/adminModel';

export const createAdmin = async (data) => {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkk")
    console.log(data)
  try {
      // let admin = await Admin.create({...data})
      return data;
  } catch (error) {
    return error
  }
};

export const checkEmailOrPhoneExist=async(data)=>{
    try {
        // let admin = await Admin.findOne({ email: data });
        return false;
    } catch (error) {
      return error
    }
   
}