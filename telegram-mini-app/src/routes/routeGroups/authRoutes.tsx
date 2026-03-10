import { lazy } from "react";
import type { RouteGroup } from "../types/routes.types";
import { ROUTES } from "../routePaths";

// Lazy load auth pages
const AuthPage = lazy(() => import("@/features/auth/pages/authPage"));
const SigninPage = lazy(() => import("@/features/auth/pages/SigninPage"));
const SignupPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/ResetPasswordPage"),
);
const VerifyEmailPage = lazy(
  () => import("@/features/auth/pages/VerifyEmailPage"),
);
const TestPage = lazy(() => import("@/../testTimeFolder/TestPage"));

// Public routes - no protection needed
export const authRoutes: RouteGroup[] = [
  {
    path: ROUTES.AUTH,
    element: <AuthPage />,
  },
  {
    path: ROUTES.SIGNIN,
    element: <SigninPage />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  {
    path: ROUTES.VERIFY_EMAIL,
    element: <VerifyEmailPage />,
  },
  {
    path: ROUTES.TEST,
    element: <TestPage />,
  },
];
