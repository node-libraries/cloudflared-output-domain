# cloudflared-output-domain

# usage

- Create tunnel

```bash
cloudflared --metrics 127.0.0.1:55555 --url http://127.0.0.1:8080
```

- Get the domain and pass it to the echo command.

```bash
npx cloudflared-output-domain --url http://127.0.0.1:55555 -- echo {url}

# output string
# https://xxxxxxxxxx.trycloudflare.com/
```

```bash
npx cloudflared-output-domain --url http://127.0.0.1:55555 -- echo {host}

# output string
# xxxxxxxxxx.trycloudflare.com
```
