export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sales';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'my super token'
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'my super token'

// Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

export const URL_GRAPHQL = process.env.NEXT_PUBLIC_URL_GRAPHQL!
export const URL_GRAPHQL_SERVER = process.env.URL_GRAPHQL!

export const SIGNATURE_KEY_SECRET = process.env.SIGNATURE_KEY_SECRET || 'FU%7GZ8*WxcsU#CUv55%sj%'