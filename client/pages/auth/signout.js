import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignOut = () => {
  const { doRequest: signout, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    signout();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
