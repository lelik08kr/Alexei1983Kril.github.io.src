import type { LoaderFunctionArgs } from "react-router-dom";
import {
  redirect,
} from "react-router-dom";
import { ApiAuthProvider } from "./../auth";

export default async function loginAction({ request }: LoaderFunctionArgs) {
    let formData = await request.formData();
    let username = formData.get("username") as string | null;
    let password = formData.get("password") as string | null;
    let redirectTo = formData.get("redirectTo") as string | null;

    // Validate our form inputs and return validation errors via useActionData()
    if (!username) {
        return {
            error: "You must provide a username to log in",
        };
    }

    if (!password) {
        return {
            error: "You must provide a password to log in",
        };
    }

    // Sign in and redirect to the proper destination if successful.
    try {
        await ApiAuthProvider.signin(username, password);
    } catch (error) {
        // Unused as of now but this is how you would handle invalid
        // username/password combinations - just like validating the inputs
        // above
        return {
            error: "Invalid login attempt",
        };
    }

    if (!redirectTo || redirectTo === undefined || redirectTo == 'undefined') {
        redirectTo = '/';
    }

    return redirect(redirectTo || "/");
}
