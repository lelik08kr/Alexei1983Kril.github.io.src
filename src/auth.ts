interface AuthProvider {
    isAuthenticated: boolean;
    username: null | string;
    password: null | string;
    signin(username: string, password: string): Promise<void>;
    signout(): Promise<void>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const fakeAuthProvider: AuthProvider = {
    isAuthenticated: false,
    username: null,
    password: null,
    async signin(username: string, password: string) {
        await new Promise((r) => setTimeout(r, 500)); // fake delay
        fakeAuthProvider.isAuthenticated = true;
        fakeAuthProvider.username = username;
        fakeAuthProvider.password = password;
    },
    async signout() {
        await new Promise((r) => setTimeout(r, 500)); // fake delay
        fakeAuthProvider.isAuthenticated = false;
        fakeAuthProvider.username = "";
        fakeAuthProvider.password = "";
    },
};
