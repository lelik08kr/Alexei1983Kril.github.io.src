import {
  redirect,
} from "react-router-dom";
import { fakeAuthProvider } from "./../auth";


export async function loginLoader() {
  if (fakeAuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}
