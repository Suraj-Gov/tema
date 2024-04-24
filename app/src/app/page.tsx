import HomeAnonUser from "@/components/sections/HomeAnonUser";
import HomeSection from "@/components/sections/HomeSection";
import { getTRPCBaseUrl } from "@/utils/env";
import { headers } from "next/headers";
import { UserProfile } from "../../../server/src/handlers/user";

const getLoggedInUser = async () => {
  // TODO figure out a way for trpc to be invoked in RSC
  try {
    const res = await fetch(`${getTRPCBaseUrl()}/user.getUser?input={}`, {
      headers: headers(),
    });
    const jsonRes = await res.json();
    const user: UserProfile = jsonRes?.result?.data;
    return user;
  } catch (err) {
    console.error("could not fetch user", err);
  }
};

export default async function HomePage() {
  const user = await getLoggedInUser();
  if (!user) {
    return <HomeAnonUser />;
  }
  return <HomeSection user={user} />;
}
