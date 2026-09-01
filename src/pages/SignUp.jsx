import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="clerk-wrap">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/account"
      />
    </div>
  );
}
