import { mkdir, writeFile } from 'node:fs/promises';
import { cwd } from 'node:process';
import { optimize } from 'svgo';
import { delay } from './delay';
import { getFileComponents } from './get-file-components';
import { getImages } from './get-images';

const main = async () => {
  const components = await getFileComponents();

  const images = {
    basicIcons: (await getImages(components.basicIcons)).map(
      ({ imageUrl, ...image }) => ({
        imageUrl,
        imagePath:
          `assets/${image.containing_frame?.pageName}/${image.containing_frame?.name?.replaceAll('Country / Language', 'country-language')}`
            .replaceAll(',', '')
            .replaceAll(' ', '-')
            .toLowerCase(),
        imageName: `${image.name?.trim()}.svg`
          .replaceAll(',', '')
          .replaceAll(' ', '-')
          .toLowerCase(),
        svgo: image.containing_frame?.name !== 'Country / Language',
        currentColor: true,
      }),
    ),
    brand: (await getImages(components.brand)).map(
      ({ imageUrl, ...image }) => ({
        imageUrl,
        imagePath:
          `assets/${image.containing_frame?.pageName}/${image.containing_frame?.name}`
            .replaceAll(',', '')
            .replaceAll(' ', '-')
            .toLowerCase(),
        imageName:
          `${image.name?.trim().toLowerCase().replaceAll('variant=', '').replaceAll('type=', '')}.svg`
            .replaceAll(',', '')
            .replaceAll(' ', '-'),
        svgo: true,
        currentColor: false,
      }),
    ),
    isometricIcons: (await getImages(components.isometricIcons)).map(
      ({ imageUrl, ...image }) => ({
        imageUrl,
        imagePath:
          `assets/${image.containing_frame?.pageName}/${image.containing_frame?.name}`
            .replaceAll(',', '')
            .replaceAll(' ', '-')
            .toLowerCase(),
        imageName:
          `${image.containing_frame?.containingComponentSet?.name?.trim()}-${image.name?.replaceAll('Size=', '').replaceAll(', Color=', '-')}.svg`
            .replaceAll(',', '')
            .replaceAll(' ', '-')
            .toLowerCase(),
        svgo: true,
        currentColor: false,
      }),
    ),
  };

  console.log('basicIcons', images.basicIcons.length);
  console.log('brand', images.brand.length);
  console.log('isometricIcons', images.isometricIcons.length);

  const allImages = [
    ...images.basicIcons,
    ...images.brand,
    ...images.isometricIcons,
  ];

  for (let image of allImages) {
    if (image.imageUrl) {
      console.log(`- downloading ${image.imagePath}/${image.imageName}`);

      const path = `${cwd()}/${image.imagePath}`;

      const result = await fetch(image.imageUrl);

      try {
        const responseData = await result.text();

        const { data } = image.svgo
          ? optimize(responseData, {
              plugins: [
                {
                  name: 'convertColors',
                  params: {
                    currentColor: image.currentColor,
                  },
                },
              ],
            })
          : { data: responseData };

        await mkdir(path, { recursive: true });
        await writeFile(`${path}/${image.imageName}`, data);
      } catch (e) {
        console.error('error', e);
      }

      delay(100);
    } else {
      console.log(`x no url for image ${image.imagePath}/${image.imageName}`);
    }
  }

  console.log('√ success');
};

main();
