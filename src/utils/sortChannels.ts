/*eslint camelcase: "error"*/

import { type BaseChannel } from "@kastelll/wrapper";

/**
 * Sorts through the channels and returns a sorted array of channels. (Stolen from Backend)
 */
export const sortChannels = (
  existingChannels: BaseChannel[],
  ignoreParent = false,
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

  const sortedExistingChannels = existingChannels.sort(
    (a, b) => a.position - b.position,
  );

  if (ignoreParent) {
    return sortedExistingChannels;
  }

  const categories: Record<string, BaseChannel[]> = {};
  const sortedChannels: BaseChannel[] = [];

  for (const channel of sortedExistingChannels) {
    if (channel.parentId) {
      if (!categories[channel.parentId]) {
        categories[channel.parentId] = [];
      }
      categories[channel.parentId].push(channel);
    } else {
      sortedChannels.push(channel);
    }
  }

  const sortedCategories = Object.values(categories).map((categoryChannels) => {
    return sortChannels(categoryChannels, true);
  });

  return [...sortedChannels, ...sortedCategories].flat(8);
};
