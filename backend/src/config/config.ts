export const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    domain: process.env.COOKIE_DOMAIN || "localhost",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000"
} as const