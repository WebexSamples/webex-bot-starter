### nGrok

**THIS IS IMPORTANT:** nGrok is a tool that will expose a port on your machine to a fixed URL controlled by nGrok's systems.  This is done as a convenience feature to make local development of your webhook fast/easy. 

nGrok details their available password-protected & enterprise/pro plans here: **https://ngrok.com/pricing**

See below for similiar **[tools and alternatives](#Tunneling-Tools)**

Long story short, using nGrok for local development means you...

1) Trust nGrok & the team building services for it

2) Trust the author of the **[nGrok npm package(^3.2.7)](https://www.npmjs.com/package/ngrok)** (which is not controlled by nGrok) which downloads an nGrok binary, its source code is available here: https://github.com/bubenshchykov/ngrok



## Background 
nGrok was developed by **[Alan Shreeve](https://twitter.com/inconshreveable)** as a way to learn Go. nGrok will open a "secure" tunnel to nGrok's system so external services (like a webhook system) can access exposed resources on your local machine as if they were deployed on the public internet. This can make developing fulfillment webhooks insanely convenient & fast-- nGrok also comes with a network inspector available on localhost:4040

## Config

If you are having any trouble, you can change the "ngrok" configuration fields in the main **[config.json file](config.json)**

```json
"ngrok": {
  "region":"us",
  "bind_tls":true
}
```
<details><summary>(Expand for details on nGrok configuration options)</summary>
<p>

There are lots of options you can use to configure nGrok, see here for details: **https://ngrok.com/docs** 

Enterprise/Pro features available here: https://ngrok.com/pricing

|  **Item** | Description |
| --- | --- |
|  **proto** | tunnel protocol name, one of http, tcp, tls |
|  **addr** | forward traffic to this local port number or network address |
|  **inspect** | enable http request inspection |
|  **auth** | HTTP basic authentication credentials to enforce on tunneled requests |
|  **host_header** | Rewrite the HTTP Host header to this value, or preserve to leave it unchanged |
|  **bind_tls** | bind an HTTPS or HTTP endpoint or both true, false, or both |
|  **subdomain** | subdomain name to request. If unspecified, uses the tunnel name |
|  **hostname** | hostname to request (requires reserved name and DNS CNAME) |
|  **crt** | PEM TLS certificate at this path to terminate TLS traffic before forwarding locally |
|  **key** | PEM TLS private key at this path to terminate TLS traffic before forwarding locally |
|  **client_cas** | PEM TLS certificate authority at this path will verify incoming TLS client connection certificates. |
|  **remote_addr** | bind the remote TCP port on the given address |
|  **metadata** | arbitrary user-defined metadata that will appear in the ngrok service API when listing tunnels |

|  Region | Code |
| --- | --- |
|  **ap** | Asia/Pacific |
|  **au** | Australia |
|  **eu** | Europe |
|  **in** | India |
|  **jp** | Japan |
|  **sa** | South America |
|  **us** | United States (default) |
</p>
</details>


## Tunneling Tools

These are provided as suggestions for further inspection only-- make sure you and/or security team to audit any tunneling tools before using on a network

- https://ngrok.com/
 
- https://localtunnel.github.io/www/

- http://localhost.run/

- https://telebit.cloud/

