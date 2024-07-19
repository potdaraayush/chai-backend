const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err))
    }
}

export {asyncHandler}


//a lot of professional codebases follow this: 
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
//while this is simple, its not necessary that only this convention
//will be followed.