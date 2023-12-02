// import { useRecoilState } from "recoil";
// import { clientStore } from "@/utils/stores";

export default function Settings_Profile({ userInfo }) {
  // const [client] = useRecoilState(clientStore);

  return <>{userInfo?.username || "Loading..."}</>;
}
