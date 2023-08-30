import schemas from "@/sanity/schemas";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { myTheme } from "./theme";
import Logo from "@/components/organisms/Sanity/Logo";

const config = defineConfig({
  projectId: "upbpewmz",
  dataset: "production",
  title: "Mentorfy Meeting",
  apiVersion: "2023-03-09",
  basePath: "/admin",
  plugins: [deskTool()],
  schema: { types: schemas },
  theme: myTheme,
  studio: {
    components: {
      logo: Logo,
    },
  },
});

export default config;
