export const buildCloudfrontUrl = (path: string) => {
  return process.env.CLOUDFRONT_DOMAIN + '/' + path;
};
