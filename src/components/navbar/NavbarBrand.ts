import Link from "next/link";
import Image from "next/image";
import { SITE_LOGO, SITE_NAME, SITE_ORG, SITE_PRODUCT } from "@/lib/utils/context";

interface NavbarBrandProps {
  onClick?: () => void;
}

export function NavbarBrand({ onClick }: NavbarBrandProps) {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      <Image
        src={SITE_LOGO}
        alt={SITE_NAME}
        width={30}
        height={30}
        priority
        className="rounded-md"
      />
      <span className="mx-auto my-auto">
        <h1 className="text-lg" style={{ fontFamily: "ConthraxSb-Regular, sans-serif" }}>
          {SITE_ORG}
          <span className="ml-1 text-xl font-bold text-red-500" style={{ fontFamily: "sans-serif" }}>
            {SITE_PRODUCT}
          </span>
        </h1>
      </span>
    </Link>
  );
}