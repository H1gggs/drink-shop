import { Avatar, Dropdown } from "flowbite-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import React from "react";
import ThemeChanger from "./DarkSwitch";

export default function Navbar() {
  const { data, status } = useSession();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);

  const imgUrl = data?.user?.image || "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" legacyBehavior>
                <a className="flex items-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                  Drink Shop
                </span>
                </a>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="/" active={router.pathname === "/"}>
                <HomeIcon className="w-5 h-5 mr-2" />
                  Գլխավոր
              </NavLink>

              <NavLink href="/store" active={router.pathname === "/store"}>
                <StoreIcon className="w-5 h-5 mr-2" />
                  Խանութ
              </NavLink>

              <NavLink href="/cart" active={router.pathname === "/cart"}>
                <CartIcon className="w-5 h-5 mr-2" />
                  Զամբյուղ
                {count > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-sky-100 text-sky-600 rounded-full">
                  {count}
                </span>
                )}
              </NavLink>

              {status === "authenticated" && (
                  <Dropdown
                      arrowIcon={false}
                      inline={true}
                      label={
                        <Avatar
                            alt="User settings"
                            img={imgUrl}
                            rounded={true}
                            className="w-10 h-10 ring-2 ring-sky-300 hover:ring-sky-400 transition-all"
                        />
                      }
                  >
                    <Dropdown.Item>
                      <button
                          className="w-full px-4 py-2 text-sm text-white bg-sky-500 hover:bg-sky-600 rounded-md transition-colors"
                          onClick={() => signOut({ callbackUrl: "/signin" })}
                      >
                          Դուրս գալ
                      </button>
                    </Dropdown.Item>
                  </Dropdown>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}

// Компонент NavLink для единообразных ссылок
// @ts-ignore
const NavLink = ({ href, active, children }) => (
    <a
        href={href}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
      ${active
            ? "text-sky-600 bg-sky-50"
            : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
        }`}
    >
      {children}
    </a>
);

// Иконки (можно заменить на свои)
const HomeIcon = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
);

const StoreIcon = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);

const CartIcon = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
    </svg>
);