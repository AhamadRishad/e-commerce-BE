import mongoose from "mongoose";



// console.log(process.env.DB_URL);

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('connected to db');
    } catch (error) {
        console.log('Error',error)
    }
}
 export default connectDb

