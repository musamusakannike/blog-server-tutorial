const cloudinary = require("../config/cloudinary");
const BlogPost = require("../model/blogpost.model");
const User = require("../model/user.model");

const blogPoster = async (req, res) => {
    const { title, content } = req.body;
    try {

        // =============== CHECKING LOGGED IN ============================= //
        const user = req.user;
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        
        const loggedInUser = await User.findOne({email: user.email});
        if(!loggedInUser){
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // ================ CHECKING FOR BLOG IMAGE ==================== //
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please upload a blog image"
            });
        }

        // ============== CHECKING ALL INPUT FIELDS ARE VALID ===================== //
        if (!title ||!content) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // ============== SAVING IMAGE FILES TO CLOUDINARY ================= //
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading image to cloudinary"
                });
            }
            const newBlog = await BlogPost.create({
                title,
                content,
                imageLink: data.secure_url,
                postedBy: loggedInUser,
            });
            res.status(201).json({
                success: true,
                message: "Blog posted successfully",
                blog: newBlog
            });
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        console.log(error);
    }
}

module.exports = {
    blogPoster
}