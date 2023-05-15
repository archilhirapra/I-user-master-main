import { TermsAndConditionsModalContent } from "src/shared/TermsAndConditionsModalContent";
function Termsandcondition() {
  return (
    <>
      <div>{TermsAndConditionsModalContent}</div>
    </>
  );
}
Termsandcondition.authGuard = false;
export default Termsandcondition;
