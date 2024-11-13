import { UnLazyImage } from "@unlazy/react";

const ThumbHash = () => {
    const thumbash = "iCgGHIiciHePZ3aId3Z3f2n3lw==";

    return (
        <div className="flex items-center justify-center align-middle">
            <UnLazyImage
                alt="thumbhash"
                src="https://uh-oh.org/i/xv86cunb5eu28lgynw.png"
                thumbhash={thumbash}
                className="h-[300px] min-w-[300px]"
            />
            <p className="mx-4">{"->"}</p>
            <UnLazyImage
                alt="thumbhash"
                thumbhash={thumbash}
                className="h-[300px] min-w-[300px]"
            />
        </div>
    )
}

export default ThumbHash;