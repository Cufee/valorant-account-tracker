**This app is a side project of mine and is in very early stages. I am planning
on further refining this concept into something that can be easily used by
anyone.**

Here is what I have in mind:\
[x] A persistent service running in the background\
[x] Automatically detect when the account is changed and pull rank details\
[x] Create a simple UI with Deno.serve and HTMX\
[-] Build a Windows executable that can be started without any dependencies

# How to get started

- Clone the code
- Install [Deno](https://deno.com/)
- `deno task start`
- Open `http://localhost:6942` in your browser

# What is Valorant Account Tracker?

This app allows you to track Valorant accounts you have used locally. The main
purpose is to store the usernames and last known competitive rank in order to
make picking an account easier.

For example, if you have played on multiple accounts and do not remember what
rank each of your accounts ended up in, you can use this app to check.

## How does it work?

Riot Client opens up a web server each time the app is launched. This API
exposes some basic information about the running instance of Valorant and the
account you are currently using.

Using this web server, we are able to request tokens for Riot API, using which
we can collect all sorts of information. As far as I understand, we can access
the entirety of the [Valorant API](https://valapidocs.techchrism.me/).
