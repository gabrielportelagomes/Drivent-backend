import app, { init, initRedis } from '@/app';

const port = +process.env.PORT || 4000;

initRedis().then(() => {
  console.log('Redis was started!');
});

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${port}.`);
  });
});
