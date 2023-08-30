import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeatureCard({ icon, title, description }) {
  return (
    <Card className="">
      <CardHeader>
        <div className="p-4 bg-primary-500 rounded-full w-min shadow">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CardDescription className="text-lg leading-6">
          {description}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
