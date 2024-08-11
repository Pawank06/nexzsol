import {config as conf} from 'dotenv'

conf()

const _config = {
    port: process.env.PORT || 4000,
    databaseUrl: process.env.DATABASE_URL,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET as string,
    clientSecret: process.env.CLIENT_SECRET,
    clientID: process.env.CLIENT_ID,
    frontEndUrl: process.env.FRONTEND_URL,
    githubAPIURL: process.env.GITHUB_API_URL,
    backendUrl: process.env.BACKEND_URL,
}

export const config = Object.freeze(_config)