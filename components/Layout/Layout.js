import { useSession, signIn, signOut } from "next-auth/react";
import { InitialLayout } from "./InitialLayout";
import LoggedInLayout from "./LoggedInLayout";

export default function Layout(props) {
  const { data: session } = useSession();
  if (!session) {
    return <InitialLayout />;
  }
  return <LoggedInLayout>{props.children}</LoggedInLayout>;
}
