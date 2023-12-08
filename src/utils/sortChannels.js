/**
 * Stolen from the Backend
 * @param {import('@kastelll/wrapper').BaseChannel[]} ExistingChannels
 * @param {boolean} IgnoreParent
 * @returns
 */
export const SortChannels = (ExistingChannels, IgnoreParent = false) => {
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

  const SortedExistingChannels = ExistingChannels.sort(
    (a, b) => a.position - b.position,
  );

  if (IgnoreParent) {
    return SortedExistingChannels;
  }

  const Categories = {};
  const SortedChannels = [];

  SortedExistingChannels.forEach((channel) => {
    if (channel.parentId) {
      if (!Categories[channel.parentId]) {
        Categories[channel.parentId] = [];
      }
      Categories[channel.parentId].push(channel);
    } else {
      SortedChannels.push(channel);
    }
  });

  const sortedCategories = Object.values(Categories).map((categoryChannels) => {
    return SortChannels(categoryChannels, true);
  });

  const flattenedCategories = [].concat(...sortedCategories);
  return [...SortedChannels, ...flattenedCategories];
};
