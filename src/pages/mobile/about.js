import { AboutUsModalContent } from "src/shared/AboutUsModalContent";

function About() {
  return (
    <>
      <div>{AboutUsModalContent}</div>
    </>
  );
}
About.authGuard = false;
export default About;
