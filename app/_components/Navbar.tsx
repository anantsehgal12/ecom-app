"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import {
  Building,
  ClipboardList,
  List,
  ShoppingBag,
  ShoppingCartIcon,
} from "lucide-react";
import React from "react";

function Navbar() {
  const user = useUser();
  const User = user.user;
  const { openSignIn } = useClerk();
  const { openSignUp } = useClerk();
  return (
    <main>
        <header className="flex justify-between items-center p-4 px-15 gap-4 h-25">
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
                <Link href="/shop" className="inline-flex items-center gap-2">
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
            </ul>
          </div>
          <div className="flex gap-4">
            <SignedOut>
              <Button className="rounded-2xl" onClick={() => openSignIn()}>
                Sign In
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => openSignUp()}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <h1>Hi, {User?.firstName} !</h1>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Cart"
                    labelIcon={<ShoppingCartIcon className="w-4 h-4" />}
                    onClick={() => (window.location.href = "/cart")}
                  />
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={<ClipboardList className="w-4 h-4" />}
                    onClick={() => (window.location.href = "/my-orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>
        </header>
    </main>
  );
}

export default Navbar;
