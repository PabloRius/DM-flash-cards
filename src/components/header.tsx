"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    if (pathname === "/concentrated") {
      router.push("/");
    } else {
      router.push("/concentrated");
    }
  };

  return (
    <header className="h-15 flex flex-row p-6 items-center justify-center">
      <Button onClick={handleClick}>
        {pathname === "/concentrated" ? "Go Home" : "Expanded definitions"}
      </Button>
    </header>
  );
}
