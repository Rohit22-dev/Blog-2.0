"use client";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { setLogin } from "@/store/slice";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Divider, Tabs, Tab } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState("Login");
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const validationState = useMemo(() => {
    if (email === "") return undefined;

    return validateEmail(email) ? "valid" : "invalid";
  }, [email]);

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (selected === "Sign Up") {
        try {
          await axios.post("https://blog-zlon.onrender.com/auth/register", {
            name,
            email,
            password,
          });
          setSelected("Login");
        } catch (error) {
          console.log(error);
        }
      }

      if (selected === "Login") {
        try {
          setLoading(true);
          const { data } = await axios.post(
            "https://blog-zlon.onrender.com/auth/login",
            { email, password }
          );
          toast.success("Login successful", { autoClose: 2000 });
          dispatch(setLogin({ user: data?.user }));
          setLoading(false);
          router.push("/");
        } catch (error: any) {
          setLoading(false);
          setError(error?.response?.data?.message);
          console.log(error?.response?.data);
        }
      }
    },
    [email, password, name, selected, router, dispatch]
  );

  return (
    <section className="w-full h-full flex flex-col mt-2 md:mt-10 items-center gap-5">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key: any) => setSelected(key)}
        variant="bordered"
      >
        <Tab key="Sign Up" title="Sign Up" />
        <Tab key="Login" title="Login" />
      </Tabs>
      <div
        className={`${
          selected === "Sign Up" && "flex-row-reverse"
        } flex md:flex-row flex-col h-fit bg-foreground-100 rounded-md`}
      >
        <div className="flex flex-col md:w-1/2 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-md justify-center items-center text-center p-10">
          <h1 className={title({ class: "mb-10" })}>
            {selected === "Login" ? "Welcome back" : "Create new account"}&nbsp;
          </h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Write and share your views.
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center flex-col items-center md:w-1/2 gap-2 md:gap-6 p-8"
        >
          <h1 className={title({ class: "mb-6 md:mb-10" })}>
            {selected}&nbsp;
          </h1>
          {selected === "Sign Up" && (
            <Input
              type="text"
              label="Username"
              size="sm"
              variant="bordered"
              value={name}
              onValueChange={(value) => setName(value)}
              className="max-w-sm"
            />
          )}
          <Input
            type="email"
            label="Email"
            size="sm"
            variant="bordered"
            value={email}
            description="We'll not share your email with others"
            color={
              validationState === "invalid" || error ? "danger" : "primary"
            }
            errorMessage={
              validationState === "invalid"
                ? "Please enter a valid email"
                : error && error
            }
            onValueChange={(value) => setEmail(value)}
            validationState={validationState}
            className="w-full"
          />

          <Input
            label="Password"
            size="sm"
            variant="bordered"
            value={password}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            onValueChange={(value) => setPassword(value)}
            type={isVisible ? "text" : "password"}
            className="max-w-sm"
          />
          <Divider className="my-4" />
          <Button
            type="submit"
            variant="shadow"
            color="primary"
            isLoading={isLoading}
          >
            {selected}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Page;
