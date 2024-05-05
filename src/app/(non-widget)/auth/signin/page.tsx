import SignInButton from "@/src/app/(non-widget)/auth/signin/sign-in-button";
import Image from "next/image";
import signInBg from "@/public/signin-screen-bg.png";
import type { Metadata } from "next/types";
import { fetchServerSessionSignIn } from "@/lib/shared/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In | WiselyDesk App",
  description: "Sign in to your WiselyDesk account"
};

export default async function SignIn() {
  await fetchServerSessionSignIn();

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-6 text-5xl font-bold tracking-tight text-black">
            Wisely<span className="text-gray-500">Desk</span>
          </h2>
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <a
                href="https://wiselydesk.com/waitlist"
                target="_blank"
                className="font-medium text-indigo-600 hover:text-indigo-500">
                join the waitlist
              </a>
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <p className="text-sm font-medium leading-6 text-gray-900">
                  Sign in with
                </p>

                <div className="mt-2 grid grid-cols-3 gap-3">
                  <div>
                    <SignInButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={signInBg}
          priority={true}
          alt="Sign in picture"
        />
      </div>
    </div>
  );
}
