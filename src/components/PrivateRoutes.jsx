import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";
import PodcastShimmer from "./common/Shimmer";
function PrivateRoutes() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <PodcastShimmer/>;
  } else if (!user || error) {
    return <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }

  return <div>PrivateRoutes</div>;
}

export default PrivateRoutes;
