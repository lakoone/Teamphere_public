import * as _cluster from 'cluster';

const cluster = _cluster as unknown as _cluster.Cluster;
if (cluster.isPrimary) {
  // const numCPUs = cpus().length;
  console.log(`Master ${process.pid} is running`);

  // make workers
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // if worker dead restart new one
  });
} else {
  // start workers
  require('./main');
  console.log(`Worker ${process.pid} started`);
}
