export const chunkArray = <T>(arr: T[], chunkSize = 10) =>
  arr.reduce<Array<T[]>>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) resultArray[chunkIndex] = []; // start a new chunk

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

export const timeout = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
