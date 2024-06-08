import { API_BASE_PATH } from "@/constant/constant"
import AuthModel from "@/model/auth"

async function getAuthData(email: string, password: string): Promise<AuthModel|null> {
    try {
        const response = await fetch(API_BASE_PATH + "/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
    
        if (response.ok) {
            const data = await response.json()
            const model: AuthModel = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: {
                    id: data.data.user.id,
                    name: data.data.user.name,
                    email: data.data.user.email
                }
            }
        
            return model;
        }

        return null;
    } catch (error) {
        return null;
    }
}

async function updateAccessToken(refreshToken: string): Promise<string|null> {
    try {
        const response = await fetch(API_BASE_PATH + "/token/update", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Refresh-Token': refreshToken
            },
        })
    
        if (response.ok) {
            const data = await response.json()
            return data.accessToken;
        }

        return null;
    } catch (error) {
        return null;
    }
}

export {
    getAuthData,
    updateAccessToken
}