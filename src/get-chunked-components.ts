import type { PublishedComponent } from '@figma/rest-api-spec';

const itemsPerChunk = 100;

export const getChunkedComponents = (components: PublishedComponent[]) =>
  components.reduce((resultArray, component, index) => {
    const chunkIndex = Math.floor(index / itemsPerChunk);

    resultArray[chunkIndex] ??= [];

    resultArray[chunkIndex].push(component);

    return resultArray;
  }, [] as PublishedComponent[][]);
