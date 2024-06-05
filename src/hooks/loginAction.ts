import type { LoaderFunctionArgs } from "react-router-dom";
import {
    redirect,
} from "react-router-dom";
import { fakeAuthProvider } from "./../auth";


export async function loginActionRequest({ request }: LoaderFunctionArgs) {
    let formData = await request.formData();
    let username = formData.get("username") as string | null;
    let password = formData.get("password") as string | null;

    console.log('loginAction');

    // Validate our form inputs and return validation errors via useActionData()
    if (!username) {
        return {
        error: "You must provide a username to log in",
        };
    }

    // Validate our form inputs and return validation errors via useActionData()
    if (!password) {
        return {
        error: "You must provide a username to log in",
        };
    }

    // Sign in and redirect to the proper destination if successful.
    try {
        await fakeAuthProvider.signin(username, password);
    } catch (error) {
        // Unused as of now but this is how you would handle invalid
        // username/password combinations - just like validating the inputs
        // above
        return {
        error: "Invalid login attempt",
        };
    }

    let redirectTo = formData.get("redirectTo") as string | null;
    return redirect(redirectTo || "/");
}

type LoginFormValues = {
    username?: string;
    password?: string;
    remember?: string;
    redirectTo?: string;
};

export async function loginActionValues(values : LoginFormValues): Promise<any> {
    let username = values.username as string | null;
    let password = values.password as string | null;

    // Validate our form inputs and return validation errors via useActionData()
    if (!username) {
        return {
        error: "You must provide a username to log in",
        };
    }

    // Validate our form inputs and return validation errors via useActionData()
    if (!password) {
        return {
        error: "You must provide a username to log in",
        };
    }

    // Sign in and redirect to the proper destination if successful.
    try {
        //await fakeAuthProvider.signin(username, password);
        //await fakeAuthProvider.signin(username, password);
        return {
            error: await fakeAuthProvider.signin(username, password),
        };
    } catch (error) {
        // Unused as of now but this is how you would handle invalid
        // username/password combinations - just like validating the inputs
        // above
        return {
            error: "Invalid login attempt",
        };
    }

}
