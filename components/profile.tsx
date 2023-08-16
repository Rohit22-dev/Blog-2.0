"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  CardFooter,
} from "@nextui-org/react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state: any) => state.counter.user);

  return (
    <Card className="h-fit hidden lg:block w-1/5 sticky top-[130px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="md"
            size="md"
            src={user?.image?.url}
            showFallback
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user?.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {user?.email}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>
          Frontend developer and UI/UX enthusiast. Join me on this coding
          adventure!
        </p>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>
      </CardBody>
      {/* <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default Profile;
