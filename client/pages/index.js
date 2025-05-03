import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? "You are signed in" : "You are not signed in"}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");
  return data;
};

export default LandingPage;
