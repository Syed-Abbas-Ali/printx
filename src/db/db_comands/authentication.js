import UserAuthModule from "../../modle/authModel.js";

export const createUser = async (data) => {
  try {
      let res = await UserAuthModule.create({...data})
      return res;
  } catch (error) {
    return error
  }
};

export const checkEmailOrPhoneExist=async(email)=>{
    try {
        let res = await UserAuthModule.findOne({ email: email });
    
        return res
    } catch (error) {
      return error
    }
   
}

export const findAndUpdate=async(data)=>{
    try {
        let res = await UserAuthModule.updateOne(
          { _id: data.id }, // Filter to match the document you want to update
          { $set: {...data} } // Update fields using $set operator
        )
        return res;
    } catch (error) {
      return error
    }
   
}