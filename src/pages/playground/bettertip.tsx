import ToolTip from "@/components/ToolTip.tsx";

const BetterTip = () => {
    return (
        <>
            <ToolTip content="Hey There">
                Hover Me
            </ToolTip>

            <ToolTip content=";3">
                <div>
                    test
                </div>
            </ToolTip>
        </>
    )
}

export default BetterTip