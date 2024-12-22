import jwt from 'jsonwebtoken'

export const generateToken = ({payload = {} , secretKey = process.env.JWT_SECRET ,expiresIn = '12d'}) => {
    return jwt.sign(payload, secretKey,{expiresIn})
}

export const verifyToken = ({token = '' , secretKey = process.env.JWT_SECRET}) => {
    return jwt.verify(token, secretKey)
}