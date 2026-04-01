import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login/login";

import Layout from "../layout";
import { Loader } from "../components/loader";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./publicRoute";

const Doctor = lazy(() => import("./../pages/doctor"));
const Patient = lazy(() => import("../pages/patient"));
const OverView = lazy(() => import("../pages/overview"));
const Appointment = lazy(() => import("../pages/appointments"));
const Laboratory = lazy(() => import("../pages/laboratory"));
const RoleMangement = lazy(() => import("../pages/roleMangement"));
const Payment = lazy(() => import("../pages/payment"));

const Setting = lazy(() => import("../pages/setting"));



const router = createBrowserRouter([
  // 🔓 PUBLIC ROUTE
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },

  // 🔐 PROTECTED ROUTES
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Layout />,
        children: [
          {
            index: true,
            path: "overview",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <OverView />
              </Suspense>
            ),
          },
          {
            path: "doctor",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <Doctor />
              </Suspense>
            ),
          },
          {
            path: "patient",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <Patient />
              </Suspense>
            ),
          },
          {
            path: "appointment",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <Appointment />
              </Suspense>
            ),
          },
          {
            path: "laboratory",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <Laboratory />
              </Suspense>
            ),
          },
          {
            path: "role-management",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <RoleMangement />
              </Suspense>
            ),
          },
          {
            path: "payment",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <Payment />
              </Suspense>
            ),
          },
          {
            path: "setting",
            element: (
              <Suspense fallback={<Loader size={100} />}>
                <Setting />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);


export default router;
