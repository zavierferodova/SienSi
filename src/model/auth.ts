import UserModel from "./user"

type AuthModel = {
    accessToken: string,
    refreshToken: string,
    user: UserModel
}

export default AuthModel