'use client'
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

import SwaggerUI from "swagger-ui-react";

const Home: NextPage = () => {
  // Serve Swagger UI with our OpenAPI schema
  return <SwaggerUI url="/api/openapi.json" />;
};

export default Home;
