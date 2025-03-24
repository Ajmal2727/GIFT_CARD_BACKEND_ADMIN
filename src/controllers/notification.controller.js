import Notification from "../models/notification.model.js"

export const getANotificationsByUserId = async(req,res) => {
    try {
        const notification = await Notification.find({userId:req.params.id})
        if(notification.length === 0){
            return res.status(404).json({ statusCode:404,success:false, message: "No notifications found for this user"})
        }
        return res.json({ statusCode:200, success:true, data: notification})
    } catch (error) {
        console.log(error) 
    }
}

export const deleteNotifications = async(req, res) => {
    const {id} = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(id , {isRead:true} ,  { new: true });

        if(!notification){
            return res.status(404).json({ statusCode:404, success:false, message: "Notification not found"})
        }
        return res.status(200).json({ statusCode:200, success:true, message: "Notification deleted successfully"})
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal server error",
        });        
    }

}