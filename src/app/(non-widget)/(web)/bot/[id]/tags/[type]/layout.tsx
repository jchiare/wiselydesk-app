import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <main className="m-4 w-screen max-w-full">{children}</main>
);

export default Layout;
