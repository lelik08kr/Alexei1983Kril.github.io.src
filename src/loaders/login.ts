import {
  redirect,
} from "react-router-dom";
import { ApiAuthProvider } from "./../providers/Auth";

export default async function loginLoader() {
    if (await ApiAuthProvider.isAuthenticated()) {
        return redirect("/");
    }
    return null;
}
