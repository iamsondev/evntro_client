import Logo from "@/components/Logo/Logo";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div>
      <div>
        <Logo></Logo>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;
