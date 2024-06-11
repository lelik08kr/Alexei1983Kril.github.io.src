import axios from "axios";
import * as jose from 'jose';
import Cookies from "js-cookie";

// @TODO:  <11-06-24, Evgeniy Blinov <evgeniy_blinov@mail.ru>> : REFACTOR IT


type AuthResponseData = {
    accessToken: string,
    refreshToken: string,
    exp: number,
}

type AccessTokenData = {
    name: string,
    uuid: string, // @TODO:  <09-06-24, Evgeniy Blinov <evgeniy_blinov@mail.ru>> : uuidv7
    exp: number,
}

type AuthStorageItem = {
    accessToken: string,
    refreshToken: string | null,
    accessTokenExp: number | null,
    uuid: string | null,  // @TODO:  <09-06-24, Evgeniy Blinov <evgeniy_blinov@mail.ru>> : uuidv7
};

class AuthStorageError {
    constructor(readonly message: string) {}

    static isInstance(err: unknown): err is AuthStorageError {
        if (err === undefined) return false
        if (typeof err !== 'object') return false
        if (err === null) return false
        return err instanceof AuthStorageError
    }
}


interface IAuthStorage {
    save(authStorageItem: AuthStorageItem): boolean;
    load(): AuthStorageItem | AuthStorageError;
}

interface IAuthProvider {
    username: null | string;
    password: null | string;
    accessTokenData: AccessTokenData,
    authResponseData: AuthResponseData,
    authStorageItem: AuthStorageItem,
    isAuthenticated(): boolean;
    init(): void;
    signin(username: string, password: string): Promise<void>;
    signout(): Promise<void>;
}

const AuthStorage: IAuthStorage = {
    save(authStorageItem: AuthStorageItem): boolean {
        try {
            Cookies.set("access_token", authStorageItem.accessToken);
            Cookies.set("refresh_token", authStorageItem.refreshToken);
            Cookies.set("access_token_exp", authStorageItem.accessTokenExp);
            Cookies.set("uuid", authStorageItem.uuid);

            return true;
        } catch (e) {
            console.log('AuthStorage[Error]', e);
            return false;
        }
    },
    //if (AuthStorageError.isInstance(result))
    load(): AuthStorageItem | AuthStorageError {
        try {
            let authStorageItem = <AuthStorageItem>{};
            authStorageItem.accessToken = Cookies.get('access_token');
            authStorageItem.refreshToken = Cookies.get('refresh_token');
            authStorageItem.accessTokenExp = Cookies.get('access_token_exp');
            authStorageItem.uuid = Cookies.get('uuid');

            return authStorageItem;
        } catch (e) {
            return new AuthStorageError(`AuthStorageError: ${e}`)
        }

    },
};

/**
 * This represents some generic auth provider API, like Firebase.
 */
const FakeApiAuthProvider: IAuthProvider = {
    username: null,
    password: null,
    accessTokenData: <AccessTokenData>{},
    authResponseData: <AuthResponseData>{},
    authStorageItem: <AuthStorageItem>{},
    isAuthenticated() : boolean {
        if (this.username === 'undefined' || !this.username) { return false; }
        if (this.authStorageItem.accessToken === 'undefined' || !this.authStorageItem.accessToken) { return false; }
        return true;
    },
    init(): void {
        let authStorageItem = AuthStorage.load();
        if (!AuthStorageError.isInstance(authStorageItem)) {
            this.authStorageItem = authStorageItem;
            if (this.authStorageItem.accessToken !== "undefined" && !!this.authStorageItem.accessToken) {
                this.accessTokenData = jose.decodeJwt(this.authStorageItem.accessToken);
                this.username = this.accessTokenData.name;
            }
        }
    },
    async signin(username: string, password: string) {
        try {
            const data = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJ1dWlkIjoiMDE4ZjcxYmQtZWJhNS03MDk2LTkwNTUtNDk3Y2UyZjE4Mzk2IiwiZXhwIjoxNzE3OTU5NzY2fQ.jGOSO88uGCZdyocwq1ajYt4kg7gw2CBwnxKgIXgQuv0",
                        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMDE4ZjcxYmQtZWJhNS03MDk2LTkwNTUtNDk3Y2UyZjE4Mzk2IiwiZXhwIjoxNzE4NTU3MzY2fQ.WimNsz6HMBnHIbmDuxAgPb1viYkdUuQitKjyrNc776Q",
                        exp: Math.round((new Date(new Date().getTime() + (24 * 60 * 60))).getTime() / 1000 ), // tomorrow
                    })
                    , 500})
            });
            this.authResponseData = <AuthResponseData>data;
            if (this.authResponseData.accessToken) {
                this.accessTokenData = jose.decodeJwt(this.authResponseData.accessToken);

                this.authStorageItem.accessToken = this.authResponseData.accessToken;
                this.authStorageItem.refreshToken = this.authResponseData.refreshToken;
                this.authStorageItem.accessTokenExp = this.authResponseData.exp;
                this.authStorageItem.uuid = this.accessTokenData.uuid;

                this.username = this.accessTokenData.name;

                AuthStorage.save(this.authStorageItem);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Axios error', error)
                //handleAxiosError(error);
            } else {
                console.log('catch error', error)
                //handleUnexpectedError(error);
            }
        }
    },
    async signout() {
        try {
            await new Promise((r) => setTimeout(r, 500)); // fake delay

            this.authStorageItem = <AuthStorageItem>{};
            this.accessTokenData = <AccessTokenData>{};
            this.username = "";
            this.password = "";

            AuthStorage.save(this.authStorageItem);
        } catch (e) {
            console.log('ApiAuthProvider:logout:', e);
        }
    },
};


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AxiosInstance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export const ApiAuthProvider: IAuthProvider = {
    ...FakeApiAuthProvider,
    //async signin(username: string, password: string) {
        //try {
            //const { data } = await AxiosInstance.post('/login', {
                //email: username,
                //password: password,
            //});
            //ApiAuthProvider.authResponseData = data;
            //if (ApiAuthProvider.authResponseData.accessToken) {
                //ApiAuthProvider.accessTokenData = jose.decodeJwt(ApiAuthProvider.authResponseData.accessToken);
                //ApiAuthProvider.username = ApiAuthProvider.accessTokenData.name;
                //ApiAuthProvider.isAuthenticated = true;
            //}
        //} catch (error) {
            //if (axios.isAxiosError(error)) {
                //console.log('Axios error', error)
                ////handleAxiosError(error);
            //} else {
                //console.log('catch error', error)
                ////handleUnexpectedError(error);
            //}
        //}
    //},
};
