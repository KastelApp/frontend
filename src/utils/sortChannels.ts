/*eslint camelcase: "error"*/

import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import constants from "$/utils/constants.ts";

/**
 * Sorts through the channels and returns a sorted array of channels. (Stolen from Backend)
 */
export const sortChannels = (
  existingChannels: BaseChannel[],
): BaseChannel[] => {
  /* position 0 = top
        So for example, with four channels:
            test1 = 0
            test2 = 1
            test3 = 2
            test4 = 3
        So test1 is at the top of the channel list due to the fact its position is 0, and four is at the bottom since its 3.

        when you introduce a category, it will be like:

            test1 = 0
            Category = 1
                -> test2 = 0
                -> test3 = 1
            test4 = 2

        overall, it's a tad confusing, the most confusing part might be how I handle new channels taking the position of old channels.
        So let's say "test5" is being made and the position is 1. This is how the output will be now:

            test1 = 0
            test5 = 1
            Category = 2
                -> test2 = 0
                -> test3 = 1
            test4 = 3

        So anything with the same position, the old stuff will be moved down one, which may or may not make a ton of sense idk

        BUT, if a user updates a channel in a category, we will only modify everything in that category and nothing else since a
        category has its own position system.
        */

  // we sort the channels by their position and if its a category it should rank higher (for now)
  const sortedChannels = existingChannels.sort((a, b) => {
    if (
      a.type === constants.channelTypes.GuildCategory &&
      b.type !== constants.channelTypes.GuildCategory
    ) {
      return -1;
    }

    if (
      b.type === constants.channelTypes.GuildCategory &&
      a.type !== constants.channelTypes.GuildCategory
    ) {
      return 1;
    }

    return a.position - b.position;
  });

  const categorys: {
    [key: string]: {
      pos: number;
      channel: BaseChannel;
    }[];
    parentless: {
      pos: number;
      channel: BaseChannel;
    }[];
  } = {
    parentless: [],
  };

  for (const channel of sortedChannels) {
    if (channel.type === constants.channelTypes.GuildCategory) {
      categorys[channel.id] = [
        {
          pos: -1, // to make sure it's at the top
          channel,
        },
      ];

      continue;
    }

    if (!channel.parentId) {
      categorys.parentless.push({
        pos: channel.position,
        channel,
      });

      continue;
    }

    if (!categorys[channel.parentId]) {
      categorys[channel.parentId] = [];
    }

    categorys[channel.parentId].push({
      pos: channel.position,
      channel,
    });
  }

  const sortedCategorys = Object.values(categorys).map((category) => {
    return category.sort((a, b) => a.pos - b.pos).map((c) => c.channel);
  });

  return sortedCategorys.flat();
};
