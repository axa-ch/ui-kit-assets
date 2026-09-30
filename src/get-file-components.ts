import type { PublishedComponent } from '@figma/rest-api-spec';
import { api } from './api';
import { fileKey } from './file-key';

export const getFileComponents = async () => {
  const components = (
    await api.getFileComponents({
      file_key: fileKey,
    })
  ).meta.components;

  return {
    basicIcons: components.filter(componentFilter('Basic Icons')),
    brand: components.filter(componentFilter('Brand')),
    // isometricIcons: components.filter(componentFilter('Isometric Icons')),
  };
};

const componentFilter =
  (containingFrame: string) => (component: PublishedComponent) =>
    component.containing_frame?.pageName === containingFrame;
