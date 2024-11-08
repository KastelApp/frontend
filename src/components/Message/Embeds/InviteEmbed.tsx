import { Avatar, Button, Chip } from "@nextui-org/react";
import cn from "@/utils/cn.ts";
import { Skeleton } from "@nextui-org/react";
import { useEditorStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import { Invite } from "@/wrapper/Stores/InviteStore.ts";
import { Hub } from "@/wrapper/Stores/HubStore.ts";
import { useCallback } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

const InviteEmbed = ({
  invite,
  skeleton,
  userId
}: {
  invite:
  | (Invite & {
    hub: Hub | null;
  })
  | null;
  skeleton?: boolean;
  userId?: string;
}) => {
  const { t } = useTranslationStore();
  const { editor } = useEditorStore();

  const addAsk = useCallback(() => {
    if (!editor) return;

    Transforms.insertText(editor, `Hey <@${userId}>, may I get a new invite?`);

    const endPoint = Editor.end(editor, []);

    Transforms.select(editor, endPoint);
    ReactEditor.focus(editor);
  }, [editor, userId]);

  const buttonOnClick = useCallback(async () => {
    if (skeleton) return;

    if (!invite?.hub) {
      addAsk();

      return;
    }
  }, [invite, addAsk, skeleton]);

  if (skeleton) {
    return (
      <div className="p-3 bg-darkAccent rounded-lg shadow-md max-w-[calc(100%-1rem)] md:max-w-sm md:mm-h-28 mm-h-40">
        <h2 className="text-medium font-semibold mb-3">
          <Skeleton className="w-64 h-6 rounded-md" />
        </h2>

        <div className="grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-2 items-center">
          <div className="row-span-2">
            <Skeleton className="rounded-xl mm-hw-10 mb-2" />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-sm ml-1">
              <Skeleton className="w-32 h-5 rounded-md" />
            </span>
            <div className="flex">
              <Skeleton className="w-10 h-4 rounded-md ml-1 mt-1" />
              <Skeleton className="w-10 h-4 rounded-md ml-1 mt-1" />
            </div>
          </div>

          <div className="hidden md:block ml-auto mt-2">
            <Skeleton className="rounded-md">
              <Button size="sm" >
                {t("hubs.invites.join")}
              </Button>
            </Skeleton>
          </div>
        </div>

        <div className="mt-3 md:hidden">
          <Skeleton className="rounded-md">
            <Button
              size="sm"
              className="w-full"
              isLoading
            >
              {t("hubs.invites.join")}
            </Button>
          </Skeleton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-darkAccent rounded-lg shadow-md max-w-[calc(100%-1rem)] md:max-w-sm  md:mm-h-28 mm-h-40">
      <h2 className={cn("text-medium font-semibold mb-3", !invite?.valid && "text-danger")}>
        {invite?.valid ? t("hubs.invites.validInvite") : t("hubs.invites.invalidInvite")}
      </h2>

      <div className="grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-2 items-center">
        <div className="row-span-2">
          <Avatar
            src="/icon-1.png"
            alt="Avatar"
            className="rounded-xl mm-hw-10 mb-2"
            imgProps={{ className: "transition-none" }}
          />
        </div>

        <div className="flex flex-col justify-center">
          {invite?.hub ? (
            <>
              <p className="text-sm ml-1">{invite.hub.name}</p>
              <div className="flex">
                <Chip
                  variant="dot"
                  color="success"
                  size="sm"
                  className="border-0 p-0 text-white"
                >
                  30 {t("hubs.online")}
                </Chip>
                <Chip
                  variant="dot"
                  color="secondary"
                  size="sm"
                  className="border-0 p-0 text-white"
                >
                  {invite.hub.memberCount} {t("hubs.members")}
                </Chip>
              </div>
            </>
          ) : (
            <p className="text-sm mt-2 ml-1 text-danger">Invalid Invite</p>
          )}
        </div>

        <div className="hidden md:block ml-auto mt-2">
          <Button color={invite?.hub ? "success" : "danger"} size="sm" variant="flat" onClick={buttonOnClick}>
            {invite?.hub ? t("hubs.invites.join") : t("hubs.invites.invalid")}
          </Button>
        </div>
      </div>

      <div className="mt-3 md:hidden">
        <Button
          color={invite?.hub ? "success" : "danger"}
          size="sm"
          variant="flat"
          className="w-full"
          onClick={buttonOnClick}
        >
          {invite?.hub ? t("hubs.invites.join") : t("hubs.invites.invalid")}
        </Button>
      </div>
    </div>
  );
};

export default InviteEmbed;