import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="clerk-wrap">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/account"
      />
    </div>
  );
}
