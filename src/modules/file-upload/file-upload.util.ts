import * as uuid from 'uuid';

export const buildBucketKey = ({
  folder,
  extension,
}: {
  folder?: string;
  extension: string;
}) => {
  const now = new Date();
  return `${
    folder ? `${folder}/` : ''
  }${uuid.v1()}_${now.getTime()}_n.${extension}`;
};
