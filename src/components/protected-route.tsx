import { useSelector } from "../services/store";
import { selectIsAuthChecked, selectUser } from "../services//slices/user-slice";
import { Navigate, useLocation } from "react-router-dom";
import Preloader from "./preloader/preloader";
import { ReactElement } from "react";

type TProtectedProps = {
    onlyUnAuth?: boolean;
    component: ReactElement;
};

export const Protected = ({onlyUnAuth = false, component} : TProtectedProps) : ReactElement | null=> {
    const user = useSelector(selectUser);
    const isAuthChecked = useSelector(selectIsAuthChecked);
    const location = useLocation();

    if (!isAuthChecked) return <Preloader />;
    

    if (!onlyUnAuth && !user) return <Navigate to="/login" state={{from: location}} />;

    if (onlyUnAuth && user) {
        const { from } = location.state || { from: { pathname: "/" } };
        return <Navigate to={from} />;
    }
    return component;
};

