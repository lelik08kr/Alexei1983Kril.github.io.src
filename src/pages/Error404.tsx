import {
    useLocation,
} from "react-router-dom";
export default function Error404() {
    let location = useLocation();

    return <h3>404 Page "{location.pathname}" Not found</h3>;
}

