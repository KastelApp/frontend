import { LeafProps } from "../SlateTypes.ts";

const Leaf = ({ attributes, children, leaf }: LeafProps) => {

    const { list, bold, italic, underlined, blockquote, code } = leaf;

    let tailwindStyles = "";

    if (bold) {
        // todo: better way of doing this, slatejs docs are shit so idk yet
        if (children?.props.leaf.text.startsWith("__") && children.props.leaf.text.endsWith("__")) {
            tailwindStyles += "underline ";
        } else {
            tailwindStyles += "font-bold ";
        }
    }

    if (italic) {
        tailwindStyles += "italic ";
    }

    if (underlined) {
        tailwindStyles += "underline ";
    }

    if (list) {
        tailwindStyles += "list-disc ";
    }

    if (blockquote) {
        tailwindStyles += "border-l-4 border-gray-400 pl-2 ";
    }

    if (code) {
        tailwindStyles += "bg-gray-200 px-1 ";
    }

    return (
        <span {...attributes} className={tailwindStyles}>
            {children}
        </span>
    );
};

export default Leaf;