import Link from "next/link";
import Image from "next/image";
import Menu from "../../components/Menu";
import Navbar from "../../components/Navbar";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] ">
        <Link href="/" className="flex iteam-center justify-center gap-2">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
          <span className="hidden lg:block">OTU</span>
        </Link>
        <Menu/>
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
        <Navbar/>
        {children}
      </div>

    </div>
  );
}