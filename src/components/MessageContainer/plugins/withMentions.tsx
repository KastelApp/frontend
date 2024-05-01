import { ReactEditor } from "slate-react";
import { ExtendedElement } from "../SlateTypes.ts";

const withMentions = (editor: ReactEditor): ReactEditor => {
  const { isInline, isSelectable, isElementReadOnly } = editor;

  editor.isInline = (element: ExtendedElement) =>
    (element.type && ["mentionBadge"].includes(element.type)) || isInline(element);

  editor.isElementReadOnly = (element: ExtendedElement) =>
    (element.type && ["mentionBadge"].includes(element.type)) || isElementReadOnly(element);

  editor.isSelectable = (element: ExtendedElement) =>
    (element.type && !["mentionBadge"].includes(element.type) && isSelectable(element)) || false;

  return editor;
};

export default withMentions;