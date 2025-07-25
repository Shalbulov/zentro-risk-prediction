import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Korzinka BI"
        description="Korzinka BI"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
