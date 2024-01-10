import spawn from 'cross-spawn';
import minimist from 'minimist';
import { getPrometheus } from '..';

const printHelp = () => {
  console.log(
    [
      'Usage: cloudflared-quick-domain -url <URL> [-s <environment>] -- [command]',
      '  -u --url <URL>                meta data url',
      '  -e --env <environment=value>  environment',
      '  command                       Commands to execute',
    ].join('\n')
  );
};

const getHostName = async (url: string) => {
  for (;;) {
    const hostname = await getPrometheus(url)
      .then((v) => v['cloudflared_tunnel_user_hostnames_counts']?.params?.userHostname)
      .catch(() => undefined);
    if (hostname) {
      return hostname;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

const main = async () => {
  const argv = process.argv.slice(2);
  const index = argv.findIndex((v) => v === '--');
  const option = index >= 0 ? argv.slice(0, index) : [];
  const command = index >= 0 ? argv.slice(index + 1) : argv;
  const params = minimist(option, {
    alias: {
      u: 'url',
      e: 'env',
    },
  });
  if (params.help || argv.length === 0 || !params.url) {
    printHelp();
    process.exit();
  }

  if (command) {
    const metaUrl = new URL(params.url);
    metaUrl.pathname = '/metrics';
    const hostname = await getHostName(metaUrl.toJSON());
    const url = new URL(hostname);
    const env = params.env?.split('=');
    if (env)
      process.env[env[0]] = env[1].replace('{url}', url.toString()).replace('{host}', url.host);

    spawn(
      command[0],
      command
        .slice(1)
        .map((v) =>
          v.replace(/"/g, '\\"').replace('{url}', url.toString()).replace('{host}', url.host)
        ),
      { stdio: 'inherit', shell: true }
    ).on('exit', function (exitCode: number) {
      process.exit(exitCode);
    });
  }
};

main();
