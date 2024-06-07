import Message from "@/components/Message/Message.tsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";

/**
 * This is for TextBased Channel's, i.e DM's, Guild Text Channels, etc.
 */
const TextBasedChannel = () => {
	return (
		<MessageContainer placeholder="Message #general" isReadOnly>
			<div className="flex flex-col-reverse overflow-x-hidden w-full">
				{Array.from({ length: 20 }, (_, i) => (
					<Message
						key={i}
						content={`${i}${i % 10 === 0 ? `${i}`.repeat(500) : ""}`}
						replying={i % 5 === 0}
						mention={i % 3 === 0}
						tag={i % 9 === 0 ? "System" : undefined}
						embeds={i % 7 === 0 ? [{
							"type": "Rich",
							"url": "https://github.com/Darker-Ink/endpoint-downloader/commit/338561627ad6b1d8237a6036d360ec43ad4557d3",
							"title": "[endpoint-downloader:master] 1 new commit",
							"description": "1".repeat(1999),
							"color": 7506394,
							"author": {
								"name": "Darker-Ink",
								"url": "https://github.com/Darker-Ink",
								"iconUrl": "https://avatars.githubusercontent.com/u/45852757?v=4"
							}
						}, {
							"title": "This is the Embed Title!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
							"description": "This is the Embed Description",
							"url": "https://google.com",
							"color": 16711680,
							"type": "Rich",
							"files": [
								{
									"name": "Image 1",
									"url": "https://development.kastelapp.com/icon-2.png",
									"height": 100,
									"width": 100,
									"type": "image",
									"rawUrl": "https://google.com"
								}
							],
							"footer": {
								"text": "This is the Footer Text",
								"iconUrl": "https://development.kastelapp.com/icon-2.png",
								"timestamp": "2021-01-01T00:00:00.000Z"
							},
							"fields": [
								{
									"name": "Field 1",
									"value": "This is a super cool duper tester ester cool cat test",
									"inline": true
								},
								{
									"name": "Field 2",
									"value": "Value 2",
									"inline": true
								},
								{
									"name": "Field 3",
									"value": "This is a super cool duper tester ester cool cat testThis is a super cool duper tester ester cool cat test",
									"inline": false
								},
								{
									"name": "Field 4",
									"value": "Value 4",
									"inline": true
								},
								{
									"name": "Field 5",
									"value": "Value 5",
									"inline": true
								},
								{
									"name": "Field 6",
									"value": "Value 6",
									"inline": true
								},
							],
							"author": {
								"name": "DarkerInk is Cool (Darkerink#1750)",
								"authorID": "000",
								"iconUrl": "https://development.kastelapp.com/icon-2.png",
								"url": "https://google.com"
							},
							"thumbnail": {
								"url": "https://development.kastelapp.com/icon-2.png",
								"rawUrl": "https://google.com"
							}
						}, {
							type: "Iframe",
							iframeSource: {
								provider: "Youtube",
								url: "https://www.youtube.com/embed/cMg8KaMdDYo?autoplay=1&auto_play=1"
							},
							color: parseInt("ff0000", 16),
							title: "TheFatRat - Fly Away feat. Anjulie",
							url: "https://www.youtube.com/watch?v=cMg8KaMdDYo",
							author: {
								name: "TheFatRat",
								iconUrl: "https://yt3.googleusercontent.com/vqx6-hhQDaWcbjjJWWp5H58l8LEBxX1gStQPXJUL2fSfUyTHgpOYrZ23v7EuURuWwM7tPwJJLw=s160-c-k-c0x00ffffff-no-rj",
								url: "https://www.youtube.com/channel/UCa_UMppcMsHIzb5LDx1u9zQ"
							}
						}, {
							type: "Iframe",
							iframeSource: {
								provider: "Youtube",
								url: "https://www.youtube.com/embed/4467BRmTUPw?autoplay=1&auto_play=1"
							},
							color: parseInt("ff0000", 16),
							title: "Raphlesia & BilliumMoto - My Love / Original MV",
							url: "https://www.youtube.com/watch?v=4467BRmTUPw",
							author: {
								name: "Noffy T. Coffee",
								iconUrl: "https://yt3.googleusercontent.com/vkvjwXZvZf4t0bF8ez-fcDDvAQlUkwgy35gueRYxqyt_lh5pf6wLlNtxYIDwrZZsiN_mz2rO-NA=s160-c-k-c0x00ffffff-no-rj",
								url: "https://www.youtube.com/@Noffy"
							}
						}] : undefined}
						invites={i % 11 === 0 ? [{
							code: "kastel-development",
							guild: {
								icon: null,
								members: {
									online: 50,
									total: 100
								},
								name: "Kastel Development"
							}
						}] : undefined}
					/>
				))}
			</div>
			<div id="bottom" />
		</MessageContainer>
	);
};

export default TextBasedChannel;
