import type { PublishedComponent } from '@figma/rest-api-spec';
import { api } from './api';
import { fileKey } from './file-key';
import { getChunkedComponents } from './get-chunked-components';

export const getImages = async (components: PublishedComponent[]) => {
  const chunks = getChunkedComponents(components);

  return (
    await Promise.all(
      chunks.map((chunk) =>
        api.getImages(
          { file_key: fileKey },
          {
            ids: chunk.map((component) => component.node_id).join(','),
            format: 'svg',
            svg_include_id: false,
          },
        ),
      ),
    )
  ).flatMap((response) =>
    Object.entries(response.images).map(([key, imageUrl]) => ({
      ...components.find((c) => c.node_id === key),
      imageUrl,
    })),
  );
};
