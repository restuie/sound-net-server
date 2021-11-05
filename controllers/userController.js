const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userRegister = async(req,res,next) =>{
    try {
        // Get user input
        const { first_name, last_name, student_number, password } = req.body;
        // Validate user input
        if (!(student_number && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ student_number });

        if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
        }
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database        
        const user = await User.create({
            first_name,
            last_name,
            student_number: student_number.toLowerCase(), // sanitize: convert student_number to lowercase
            password: encryptedPassword,
        });
        // Create token
        const token = jwt.sign(
            { user_id: user._id, student_number },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;        
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }    
}

const userLogin = async(req,res,next) =>{
    try {
        // Get user input
        const {student_number,password} = req.body
        // Validate user input
        if(!(student_number && password)){
            res.status(400).send("All input is required")
        }
         // Validate if user exist in our database
        const user = await User.findOne({student_number})

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, student_number },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;
            res.status(200).json(user)
        }
        else
            res.status(400).send("Invalid Credentials");
    } catch (error) {
        console.log(error);
    }
}




module.exports = {
    userRegister,
    userLogin,
}