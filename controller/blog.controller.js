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

// ============== LIKE A BLOG POST ================= //
// http://localhost:5000/api/v1/blog/like?blogId=64d37201837201837201837201837201

const blogLikeController = async (req, res) => {
    try {
        const blogId = req.query.blogId;

        // =============== GETTING THE BLOG TO LIKE ================== //
        const blog = await BlogPost.findById(blogId);
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // =============== GETTING THE USER TO LIKE ================== //
        const user = req.user;
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // =============== CHECKING IF THE USER HAS ALREADY LIKED THE BLOG ================== //
        let updatedBlog;
        if( blog.like && blog.like.includes(user._id)){
            // =============== UNLIKING THE BLOG ================== //
            updatedBlog = await BlogPost.findByIdAndUpdate(blogId, {
                $pull: {
                    like: user._id
                }
            },
         )
        }  else {
            // =============== LIKING THE BLOG ================== //
            updatedBlog = await BlogPost.findByIdAndUpdate(blogId, {
                $push: {
                    like: user._id
                }
            })
         }
        //  =============== SENDING THE RESPONSE ================== //
        res.status(200).json({
            success: true,
            message: "Blog liked successfully",
            blog: updatedBlog
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        console.log(error);
    }
}

function getSingleBlog(req, res) {
    const blogId = req.params.id;
    BlogPost.findById(blogId)
        .populate("postedBy", "name email")
        .then((blog) => {
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Blog fetched successfully",
                blog: blog
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
            console.log(err);
        });
}

module.exports = {
    blogPoster, blogLikeController, getSingleBlog
}
