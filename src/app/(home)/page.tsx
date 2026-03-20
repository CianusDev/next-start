import { LayoutPage } from "@/components/layouts/layout-page";
import { clientEnv } from "@/config/env";
import { createLoader } from "@/lib/loader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${clientEnv.APP_NAME} - Home`,
  description: "Welcome to the homepage of the app.",
};

const loadHomeData = createLoader("/", async ({ params, searchParams }) => {
  return {
    message: "Welcome to NextStart !",
  };
});

export default async function Page(props: typeof loadHomeData.Props) {
  const data = await loadHomeData(props);
  return (
    <LayoutPage className="items-center justify-center gap-4 min-h-screen">
      <h1 className="text-4xl font-semibold">{data.message}</h1>
    </LayoutPage>
  );
}
