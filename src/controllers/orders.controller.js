import Order from "../models/orders.model.js"


export const getAllOrders = async(req,res) => {
    try {
        const orders = await Order.find({});

        if (orders.length === 0) {
           return res.status(404).json({statusCode:404,success:false,message:"No orders found"})
        }
           return res.status(200).json({statusCode:200,success:true,data:orders})

    } catch (error) {
        console.log(error)
    }
}

export const getUserOrders = async(req,res) => {
    const {id} = req.params
    try {
        const orders = await Order.find({userId:id});
        if(orders.length === 0 ){
            return res.status(404).json({statusCode:404,success:true, message:"No orders found"})
        }
        return res.status(200).json({statusCode:200, success:true, data:orders})
    } catch (error) {
        console.log(error)
        
    }

}