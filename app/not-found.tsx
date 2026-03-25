import Link from "next/link";
import NotFound from "@/components/ui/not-found"; // your particle effect component

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <NotFound
        particleCount={10000}
        particleSize={4}
        animate={true}
        buttonText="Go Back"
        buttonHref="/"
        className="custom-shadow"
      />
    </div>
  );
}
