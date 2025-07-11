import jwt from 'jsonwebtoken';

const saveDashUserCooke = (res, dashUserId, message, statusCode = 200) => {
    const token = jwt.sign({ dashUserId: dashUserId }, process.env.JWT_SECRET, {
        expiresIn: '10d',
    });

    res.status(statusCode).cookie("dash_token", token, {
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: 'None', // Required for cross-site cookies
        maxAge: 10 * 24 * 60 * 60 * 1000,
    }).json({
        success: true,
        message,
    });
}

export default saveDashUserCooke;