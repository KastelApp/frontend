import RichEmbed from "@/components/Message/Embeds/RichEmbed.tsx";
import React from "react";


/**
 * Just random testing stuff, may change or be removed at any time
 */

const Rnd = () => {
    return (
        <div className="">
            <RichEmbed embed={{
                "title": "This is the Embed Title!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", // ? max of 256 characters (Supports limited markdown)
                "description": "This is the Embed Description", // ? max of 2048 characters (Supports markdown)
                "url": "https://google.com", // ? max of 256 characters (Turns title into a hyperlink)
                "color": 16711680, // ? The color code
                "type": "Rich", // ? can be Rich or Iframe, iframe is reserved for specific websites
                "files": [ // ? Max of 4 files
                    {
                        "name": "Image 1", // ? Optional, can be left blank & max is 256 characters
                        // ? This is required, can be a normal image url (in which case it gets proxied) or "attachment://filename.png" (which requires a file in the message payload to be named filename.png)
                        // ? When proxied, this will be the proxy url (see below for non proxied url)
                        "url": "https://development.kastelapp.com/icon-2.png",
                        "height": 100, // ? Optional, can be left this is mainly for the response
                        "width": 100, // ? Optional, can be left this is mainly for the response
                        "type": "image", // ? can be image or video
                        "rawUrl": "https://google.com" // ? This is the non proxied url
                    }
                ],
                "footer": {
                    "text": "This is the Footer Text", // ? max of 256 characters (Supports limited markdown)
                    "iconUrl": "https://development.kastelapp.com/icon-2.png", // ? max of 256 characters (can be from files if so do "files://filename.png") must provide a file name though
                    "timestamp": "2021-01-01T00:00:00.000Z" // ? ISO8601 timestamp
                },
                "fields": [ // ? max of 25 fields
                    {
                        "name": "Field 1", // ? max of 256 characters
                        "value": "Value 1", // ? max of 1024 characters (Supports markdown)
                        "inline": true // ? true or false
                    },
                    {
                        "name": "Field 2", // ? max of 256 characters
                        "value": "Value 2", // ? max of 1024 characters (Supports markdown)
                        "inline": true // ? true or false
                    },
                    {
                        "name": "Field 3", // ? max of 256 characters
                        "value": "Value 3", // ? max of 1024 characters (Supports markdown)
                        "inline": false // ? true or false
                    },
                    {
                        "name": "Field 4", // ? max of 256 characters
                        "value": "Value 4", // ? max of 1024 characters (Supports markdown)
                        "inline": true // ? true or false
                    },
                    {
                        "name": "Field 5", // ? max of 256 characters
                        "value": "Value 5", // ? max of 1024 characters (Supports markdown)
                        "inline": true // ? true or false
                    },
                    {
                        "name": "Field 6", // ? max of 256 characters
                        "value": "Value 6", // ? max of 1024 characters (Supports markdown)
                        "inline": true // ? true or false
                    },
                ],
                "author": {
                    "name": "DarkerInk is Cool (Darkerink#1750)", // ? max of 256 characters
                    "authorID": "000", // ? If you provide an author id, we fetch the user from db and set their avatar as the icon and the name will be "<Global Nickname> (<Username#tag>)"
                    "iconUrl": "https://development.kastelapp.com/icon-2.png", // ? max of 256 characters (can be from files if so do "files://filename.png") must provide a file name though
                    "url": "https://google.com" // ? max of 256 characters (https only)
                },
                "thumbnail": {
                    "url": "https://development.kastelapp.com/icon-2.png", // ? max of 256 characters (can be from files if so do "files://filename.png") must provide a file name though
                    "rawUrl": "https://google.com" // ? This is the non proxied url
                }
            }} />
        </div>
    );
};

export default Rnd;