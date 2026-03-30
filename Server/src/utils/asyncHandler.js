
const asyncHandler = async(handler) => 
    (req, res, next) => {
        Promise.resolve(handler(req, res, next))
        .catch((err) => next(err))
}

export {asyncHandler}