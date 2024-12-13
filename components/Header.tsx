"use client";

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useBasketStore from "@/app/(store)/store";

function Header() {
  const { user } = useUser();

  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const searchParams = useSearchParams();

  const query = searchParams.get("query");

  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(query || "");
  }, [query]);

  // Add this feature later

  // async function createClerkPassKey() {
  //   try {
  //     const response = await user?.createPasskey();
  //     console.log(response);
  //   } catch (error) {
  //     console.log("Error", JSON.stringify(error, null, 2));
  //   }
  // }

  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-2">
      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between w-full">
        <Link
          className="hover:opacity-50 sm:mx-0 mx-auto text-2xl font-bold text-blue-500 cursor-pointer"
          href="/"
        >
          Shopy
        </Link>
        <Form
          action="/search"
          className="sm:w-auto sm:flex-1 sm:mx-4 sm:mt-0 w-full mt-2"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full max-w-4xl px-4 py-2 text-gray-800 bg-gray-100 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form>
        {/* My basket part */}
        <div className="sm:mt-0 sm:flex-none flex items-center flex-1 mt-4 space-x-4">
          <Link
            href="/basket"
            className="sm:justify-start sm:flex-none hover:bg-blue-700 relative flex items-center justify-center flex-1 px-4 py-2 space-x-2 font-bold text-white bg-blue-500 rounded"
          >
            <TrolleyIcon className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
            <span>My Basket</span>
          </Link>

          {/* User Area */}
          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className="sm:justify-start sm:flex-none hover:bg-blue-700 relative flex items-center justify-center flex-1 px-4 py-2 space-x-2 font-bold text-white bg-blue-500 rounded"
              >
                <PackageIcon className="w-6 h-6" />
                <span>My Orders</span>
              </Link>
            </SignedIn>
            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />

                <div className="sm:block hidden text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user.fullName}</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}

            {/* {user?.passkeys.length === 0 && (
              <button
                onClick={createClerkPassKey}
                className="hover:bg-blue-700 hover:text-white animate-pulse px-4 py-2 font-bold text-blue-500 bg-white border border-blue-300 rounded"
              >
                Create a passkey
              </button>
            )} */}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export default Header;
