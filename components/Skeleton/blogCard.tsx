"use client";
import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

export default function BlogCard() {
  return (
    <Card className="w-full space-y-5 p-3" radius="lg">
      <Skeleton className="rounded-lg">
        <div className="h-60 rounded-lg bg-default-300"></div>
      </Skeleton>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-6 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-full rounded-lg">
          <div className="h-24 w-full rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  );
}
