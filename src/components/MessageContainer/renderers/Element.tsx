import { MainProps } from "../SlateTypes.ts";

const Element = (props: MainProps) => {
    const { attributes, children, element, } = props;

    // todo: implement the logic for mentions
    switch (element.type) {
        default: {
            return <div {...attributes}>{children}</div>;
        }
    }
};

export default Element;