import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/register-form";

export default function UserRegisterPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f0f10]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex rounded-full bg-[#fde8ec] px-4 py-2 text-sm font-semibold text-[#d92847]">
            Personal account
          </div>
          <div className="space-y-3">
            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Register as a ticket buyer.
            </h1>
            <p className="max-w-lg text-base leading-7 text-[#6b6b70]">
              Create your account to get fast checkout, ticket history, and secure QR-code delivery to your phone and email.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full border border-[#ececec] bg-white px-5 py-3 text-sm font-semibold text-[#6b6b70] transition hover:bg-[#f4f4f5]">
              Login instead
            </Link>
            <Link href="/events" className="rounded-full bg-[#f33959] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d92847]">
              Browse events
            </Link>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
          <div className="mb-8 flex justify-center">
            <Image src="/eTikket.png" alt="eTikket" width={128} height={40} priority className="h-auto w-32" />
          </div>
          <RegisterForm role="user" redirectPath="/user/home" />
        </div>
      </div>
    </main>
  );
}
