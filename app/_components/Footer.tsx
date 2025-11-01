import { Building, ClipboardList, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="mx-15 my-2">
      <div className="flex justify-between items-center h-30">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="https://i.ibb.co/KzpsqQD9/ve.png"
            alt="Logo"
            width={70}
            height={70}
          />
          <h1 className="text-xl font-bold">VAM Enterpises</h1>
        </Link>
        <div>
          <ul className="flex gap-10">
            <li className="hover:underline">
              <Link href="" className="inline-flex items-center gap-2">
                <ShoppingBag />
                Shop
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="" className="inline-flex items-center gap-2">
                <Building />
                About Us
              </Link>
            </li>
            <li className="hover:underline">
              <Link href="" className="inline-flex items-center gap-2">
                <ClipboardList />
                My Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <hr className="w-full my-[1.5]"/>
      <div>
        <div className="flex justify-center items-center h-10">
          <h1>© 2025 VAM Enterprises. All Rights Reserved. </h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
