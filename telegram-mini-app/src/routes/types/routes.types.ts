import type { RouteObject } from "react-router-dom";
import type { ReactNode } from "react";
import { UserRole } from "@/types/user.types";

export type RouteConfig = RouteObject & {
  title?: string;
  showInNav?: boolean;
  icon?: ReactNode;
  roles?: UserRole[];
  children?: RouteConfig[];
};

export interface RouteGroup {
  path: string;
  element: ReactNode;
  roles?: UserRole[];
  children?: RouteConfig[];
}

export type RouteGroups = {
  auth: RouteGroup[];
  customer: RouteGroup[];
  vendor: RouteGroup[];
  delivery: RouteGroup[];
  shared: RouteGroup[];
};
