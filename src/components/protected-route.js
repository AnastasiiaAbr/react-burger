import { useSelector } from "react-redux";
import { selectIsAuthChecked, selectUser } from "../services/user-slice";
import { Navigate, useLocation } from "react-router-dom";
import Preloader from "./preloader/preloader";
import PropTypes from 'prop-types';


export const Protected = ({onlyUnAuth = false, component}) => {
    const user = useSelector(selectUser);
    const isAuthChecked = useSelector(selectIsAuthChecked);
    const location = useLocation();

    if (!isAuthChecked) {
        return <Preloader />;
    }

    if (!onlyUnAuth && !user) {
        return <Navigate to="/login" state={{from: location}} />;
    }

    if (onlyUnAuth && user) {
        const { from } = location.state || { from: { pathname: "/" } };
        return <Navigate to={from} />;
    }

    return component;
};

Protected.propTypes = {
  onlyUnAuth: PropTypes.bool,
  component: PropTypes.element.isRequired,
};