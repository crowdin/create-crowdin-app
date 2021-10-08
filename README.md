# Create Crowdin App
Create Crowdin App with all common logic that allows you to quickly develop your own Crowdin App.

## More about Crowdin Apps
- [About Crowdin Apps](https://support.crowdin.com/crowdin-apps/)
- [Getting Started](https://support.crowdin.com/crowdin-apps-introduction/)

## Crowdin App Registration
- Go to you organization settings, OAuth apps
- Create a new app with all scopes

Then you will receive client id and client secret for your app which will be used for deployment.

## Launch the App
Once you have client id and secret you also need to have url where your app will be publicly accessible from the internet.

For development purposes you can use [ngrok](https://ngrok.com/).

```sh
ngrok http 3000
```

Now we are good to clone and start Crowdin App

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

And start the app with providing following env variables:
- CROWDIN_CLIENT_ID - client id that we received when registering the app
- CROWDIN_CLIENT_SECRET - client secret that we received when registering the app
- BASE_URL - https URL where app is reachable from the internet (e.g. the one that ngrok generates for us)

```sh
CROWDIN_CLIENT_ID=client_id CROWDIN_CLIENT_SECRET=client_secret BASE_URL=https://123-456.ngrok.io npm run start
```

There are a few more `npm` scrips you can use for development. For example:
- `start:dev` - to have live reloading every time when you will change source files 
- `start:debug` - to be able to debug your app

After this command you should be able to get your app manifest `https://123-456.ngrok.io/manifest.json`.

## Deploy your App to Crowdin
- Go to you organization settings, Apps
- Manual install, paste url to your app manifest (`https://123-456.ngrok.io/manifest.json`)
- Specify under what projects this app will be available (e.g. leave default setup for all projects)
- Open any project where this app supposed to be, Applications -> Custom
- Now you can play with your Crowdin App and add more features to it

## Technical details

Project is written by using [NestJS framework](https://nestjs.com/) so in case you haven't worked with it yet, please check it out.  
[SQLite](https://www.sqlite.org/) is used to persist users credentials for Crowdin and integration APIs.
For App UI [Crowdin UI Kit](https://crowdin-web-components.s3.amazonaws.com/index.html) is used.

This sample App shows example of integration with other service where authentication is done via `apiToken` which will be added to every request.  
If this fits your use case then you will only need to implement your logic in `IntegrationService`.  
Otherwise, you will need to review and rework logic how credentials for integration are stored (`IntegrationCredentialsService` and dao layer as well) and how end points are protected (`IntegrationContextGuard` and `IntegrationApiKey`).  

## Contributing
If you want to contribute please read the [Contributing](/CONTRIBUTING.md) guidelines.

## Seeking Assistance
If you find any problems or would like to suggest a feature, please feel free to file an issue on Github at [Issues Page](https://github.com/crowdin/crowdin-apps-functions/issues).

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



