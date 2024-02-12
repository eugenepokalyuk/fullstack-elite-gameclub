import React, { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../services/hooks/hooks";

export interface ProtectedRouteProps {
    auth?: boolean;
    children: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ auth, children }) => {
    const location = useLocation();
    const userAuth = useAppSelector((store) => store.auth.user);

    if (userAuth && !auth) {
        const { from } = location.state || { from: { pathname: "/" } };
        return <Navigate to={from} />;
    }

    if (!userAuth && auth) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;