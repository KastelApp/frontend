import API from "@/wrapper/API.ts";
import React, { useEffect } from "react";


/**
 * Just random testing stuff, may change or be removed at any time
 */

const Rnd = () => {

    useEffect(() => {
        const api = new API("123")

        console.log(api);

        const fetched = async () => {
            const fetch = await api.get({
                url: "/",
                noAuth: true,
                noVersion: true
            })

            console.log(fetch);
        }

        fetched()
    }, [])

    return (
        <div className="">
          
        </div>
    );
};

export default Rnd;