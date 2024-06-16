import Admin from "../models/adminModel.js";

export const removeAdmin = async (req, res) => {
    try {
        // its not complete the only manager can delete admin 
        // AND IF THAT ADMIN LISTED ANY PRODUCTS DELETE THAT ALSO
        const id = req.params.id;
        console.log(id);

        const admin = await Admin.find({ _id: id });
        if(!admin){
            return res.status(404).send("Admin not found");
        }

        const remove = await Admin.deleteOne({ _id: id })

        if(!remove) {
            return res.status(404).send("failed to remove");
        }

        return res.send('removed successfully')
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("could't remove admin ");
    }
}

export const getAllAdmins = async (req,res) => {
    try {
        console.log('hitted get all admins');
        const admins = await Admin.find();
        res.status(200).send(admins);
        
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("admin doesn't exist ");
    }
}

// one api is remaining is => if admin upload a product manager have to accept it if not it ll never list any where

export default {
    removeAdmin,
    getAllAdmins,
}