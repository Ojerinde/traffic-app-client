import Link from "next/link";

const LandingPage = () => {
  return (
    <section className="landing-page">
      <h1>Traffic App Home</h1>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
    </section>
  );
};
export default LandingPage;
