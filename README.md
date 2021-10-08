# Create Crowdin App

Build apps to customize and extend the experience of your team and business or for all the teams already using Crowdin to localize their products.

By creating Crowdin apps, developers can integrate existing services with Crowdin, add new features, upload and manage content.

_Create Crowdin App_ is a template that allows you to quickly develop your own Crowdin app :rocket:

It contains all things needed to start writing your own app and allows you to focus only on writing integration-specific code.

## More about Crowdin Apps
- [About Crowdin Apps](https://support.crowdin.com/crowdin-apps/)
- [Getting Started](https://support.crowdin.com/crowdin-apps-introduction/)

## Creating an OAuth App

First, you need to create an OAuth App to be able to make authorized requests from your app to Crowdin. After creating an OAuth App you will receive Client ID and Client Secret values which will be used later for deployment.

For more about Creating an OAuth App see the documentation:
- [Crowdin](https://support.crowdin.com/creating-oauth-app/)
- [Crowdin Enterprise](https://support.crowdin.com/enterprise/creating-oauth-app/)

## Launch the App

Clone this repo and install dependencies:

```sh
git clone git@github.com:crowdin/create-crowdin-app.git
```

### npm
```sh
npm install
```

### Yarn
```sh
yarn install
```

Once you have Client ID and Client Secret you also need to have a URL where your app will be publicly accessible from the internet. For development purposes you can use [ngrok](https://ngrok.com/).

Running ngrok to make your app public:

```sh
ngrok http 3000
```

And start the app by providing the following env variables:
- `CROWDIN_CLIENT_ID` - client id that we received when registering the app
- `CROWDIN_CLIENT_SECRET` - client secret that we received when registering the app
- `BASE_URL` - HTTPS URL where an app is reachable from the internet (e.g. the one that ngrok generates for us)

Run in console:

```sh
CROWDIN_CLIENT_ID=client_id CROWDIN_CLIENT_SECRET=client_secret BASE_URL=https://123-456.ngrok.io npm run start
```

Please make sure you provided a valid Client ID, Client Secret, and Base URL before executing this command.

There are a few more `npm` scrips you can use for development. For example:
- `start:dev` - to have live reloading every time when you will change source files
- `start:debug` - to be able to debug your app

After this command you should be able to get your app manifest `https://123-456.ngrok.io/manifest.json` (to check this, just try to open your manifest URL in the browser).

Now you can install your app in Crowdin.

## Crowdin App Installation

To connect the app with your project in **Crowdin Enterprise**, please follow these steps:

- Open _Organization Settings_ > _Apps_ tab and click _Manual install_ button.
- Paste the URL to your app manifest (e.g. `https://123-456.ngrok.io/manifest.json`) and click _Install_.
- Select the users that will be able to use the app and the projects where users will be able to use the app.
- Open any project where this app is supposed to be, _Applications_ > _Custom_.
- Now you can play with your Crowdin App and add more features to it :tada:

To connect the app with your project in **Crowdin**, please follow these steps:

- Open _Account Settings_ > _Crowdin Applications_ tab and click _Manual install_ button.
- Select the users that will be able to use the app and the projects where users will be able to use the app.
- Open any project where this app is supposed to be, _Applications_ > _Custom_.
- Now you can play with your Crowdin App and add more features to it :tada:

## Technical details

This project is written by using [NestJS framework](https://nestjs.com/) so in case you haven't worked with it yet, please check it out. 
[SQLite](https://www.sqlite.org/) is used to persist user's credentials for Crowdin and integration APIs.
For App UI [Crowdin UI Kit](https://crowdin-web-components.s3.amazonaws.com/index.html) is used.

This sample App shows an example of integration with other services where authentication is done via `apiToken` which will be added to every request.

If this fits your use case then you will only need to **implement your logic** in `IntegrationService` :computer:

Otherwise, you will need to review and rework logic how credentials for integration are stored (`IntegrationCredentialsService` and dao layer as well) and how end points are protected (`IntegrationContextGuard` and `IntegrationApiKey`).

## Contributing
If you want to contribute please read the [Contributing](/CONTRIBUTING.md) guidelines.

## Seeking Assistance
If you find any problems or would like to suggest a feature, please feel free to file an issue on GitHub at [Issues Page](https://github.com/crowdin/crowdin-apps-functions/issues).

If you've found an error in these samples, please [Contact Customer Success Service](https://crowdin.com/contacts).

## License
<pre>
The Create Crowdin App is licensed under the MIT License. 
See the LICENSE.md file distributed with this work for additional 
information regarding copyright ownership.

Except as contained in the LICENSE file, the name(s) of the above copyright
holders shall not be used in advertising or otherwise to promote the sale,
use or other dealings in this Software without prior written authorization.
</pre>
