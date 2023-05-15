import { PrivacyPolicyModalContent } from "src/shared/PrivacyPolicyModalContent";
function policy() {
  return (
    <>
      <div>{PrivacyPolicyModalContent}</div>
    </>
  );
}
policy.authGuard = false;
export default policy;
