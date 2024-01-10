export const getPrometheus = async (url: string) =>
  fetch(url)
    .then((v) => v.text())
    .then((v) =>
      Object.fromEntries(
        v
          .split('\n')
          .filter((v) => !v.startsWith('#') && v.length)
          .map((v) => v.match(/^([^{\s]+)(?:\{([^}]*)\})?\s*([\d.e+-]*)$/)!)
          .map(([, key, rawParams, value]) => [
            key,
            {
              params: rawParams
                ? Object.fromEntries(
                    rawParams
                      .split(',')
                      .map((v) => v.split('='))
                      .map(([k, v]) => [k, v.replace(/"/g, '')])
                  )
                : undefined,
              value: parseFloat(value),
            },
          ])
      )
    );
