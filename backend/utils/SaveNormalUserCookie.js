import jwt from 'jsonwebtoken';

const SaveUserCookie = (res, userId, message, statusCode = 200) => {
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: '10d',
    });

    res.status(statusCode).cookie("user_token", token, {
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: 'None', // Required for cross-site cookies
        maxAge: 10 * 24 * 60 * 60 * 1000,
    }).json({
        success: true,
        message,
    });
}

export default SaveUserCookie;