const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function userRegistrationController(req, res){
    const { name, password, email } = req.body;
    try {

        // ============== CHECKING ALL INPUT FIELDS ARE VALID ===================== //
        if(!name || !password || !email){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // ================= CHECK IF USER EXISTS ================== //
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // ================= ENCRYPTING USER PASSWORD ================== //
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ================= CREATING NEW USER ================== //
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // ================= SENDING RESPONSE ================== //
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        console.log(error);
    }
}

const userLoginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if(!userExists) {
            return res.status(404).json({
                "success": false,
                message: "Invalid credentials"
            });
        }

        const comparePassword = await bcrypt.compare(password, userExists.password);

        if(!comparePassword) {
            return res.status(404).json({
                "success": false,
                message: "Invalid credentials"
            })
        }

        // ================== CREATING TOKEN ============== //
        const token = jwt.sign({
            id: userExists._id,
            name: userExists.name,
            email: userExists.email,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // ================= SENDING RESPONSE ================== //
        res.cookie("token", token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true});
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        console.log(error);
    }
}

module.exports = {userRegistrationController, userLoginController};