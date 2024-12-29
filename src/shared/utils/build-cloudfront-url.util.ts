export const buildCloudfrontUrl = (path: string) => {
  return process.env.CLOUDFRONT_DOMAIN + '/' + path;
};

export const removeCloudfrontDomain = (path: string) => {
  return path.replace(process.env.CLOUDFRONT_DOMAIN + '/', '');
};
