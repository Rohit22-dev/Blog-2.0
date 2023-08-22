import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Link,
} from "@nextui-org/react";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  SearchIcon,
} from "@/components/Icons";

import { Logo1 } from "@/components/Icons";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isLoggedIn, setLogout } from "@/store/slice";

const NavHeader = () => {
  const pathName = usePathname();
  const user = useSelector((state: any) => state.counter.user);
  const dispatch = useDispatch();
  const isLogin = useSelector(isLoggedIn);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const handleLogout = () => {
    dispatch(setLogout);
  };

  return (
    <NextUINavbar
      isBordered
      shouldHideOnScroll
      maxWidth="2xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-3" href="/">
            <Logo1 />
            <p className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              STORY SAGE
            </p>
          </NextLink>
        </NavbarBrand>
        {isLogin && (
          <ul className="hidden md:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({
                      color: item.href === pathName ? "primary" : "foreground",
                    }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        )}
      </NavbarContent>

      {isLogin && (
        <>
          <NavbarContent
            className="hidden md:flex basis-1/5 sm:basis-full"
            justify="end"
          >
            <NavbarItem className="hidden md:flex gap-2">
              <Link
                isExternal
                href={siteConfig.links.github}
                aria-label="Github"
              >
                <GithubIcon className="text-default-500" />
              </Link>
              <ThemeSwitch />
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user?.name}
                  size="sm"
                  src={user?.image?.url}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue="Signed in as"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="settings" textValue="Settings">
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="help_and_feedback"
                  textValue="Help & Feedback"
                >
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  // onClick={handleLogout}
                  textValue="Log Out"
                >
                  <Link color="danger" href="/login">
                    Log Out
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>

          <NavbarContent className="md:hidden basis-1 pl-4" justify="end">
            <Link isExternal href={siteConfig.links.github} aria-label="Github">
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
            <NavbarMenuToggle />
          </NavbarContent>

          <NavbarMenu>
            {searchInput}
            <div className="mx-4 mt-2 flex flex-col gap-2">
              {siteConfig.navMenuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  {index === siteConfig.navMenuItems.length - 1 ? (
                    <Link color="danger" size="lg" onClick={handleLogout}>
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      color={item.href === pathName ? "primary" : "foreground"}
                      href={item.href}
                      size="lg"
                    >
                      {item.label}
                    </Link>
                  )}
                </NavbarMenuItem>
              ))}
            </div>
          </NavbarMenu>
        </>
      )}
    </NextUINavbar>
  );
};

export default NavHeader;
