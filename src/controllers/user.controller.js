import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    //get user data
    //validate user data
    //check if user is already registered: check username, email
    //check for images
    //upload on cloudinary
    //check if upload was successful
    //create user - create in db
    //rmeove pass and refresh token field from response
    //check if user was created
    //send response

    const {fullname,email, username, password} = req.body
    console.log("email: ", email);

    //validation code from here
    if([fullname, email, password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {throw new ApiError(409, "User already exists.")}

    //to check for files, etc. we will use multer.
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //this avatar field is gotten in from user.routes.js
    //we could use path cause we defined the method such that multer
    //could give us the original filename, path, etc. multer has brought the file on our server
    //checking for avatar is crucial since its defined as a required attribute
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, "avatar file is required.")
    }

    //next step is to upload file to cloudinary using the methods
    //we defined in cloudinary.js under utils.
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    //uploading of files like these will take time on server.
    //therefore weve written an await function and thats why we defined an async function


    //next step is to check if the avatar upload was sccuessful
    if(!avatar) {
        throw new ApiError(400, "avatar file is required.")
    }

    //next step is to create a user.
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //after creating a user, mongoDB by itself creates an "_id"
    //attribute. so, to check if the user is created. we will use this method
    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user.")
    }
    
    //now the last step is to send a response.
    res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )

})

export {registerUser}