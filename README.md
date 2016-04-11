# Facebook Event Link Resolver

Uses the MixMax API to create a link resolver integration. 

Upon pasting a link (of a public event) in the form:
> https://www.facebook.com/events/1101186573235527/

the integration will add a dynamically generated event preview including the event's
  - name
  - cover photo
  - host
  - description
  - date/time
  - number of people going
  - location
  - link to event on Facebook
  - add to Google Calendar button


![alt text](http://i.imgur.com/mFPjpeU.png "Sample Screenshot")


The code is based off of the sample code at http://sdk.mixmax.com/docs/tutorial-giphy-link-preview and calls Facebook's Graph API https://developers.facebook.com/docs/graph-api/reference/event

### Installation

```sh
$ npm install
```

```sh
$ npm start
```

### Adding the Integration

| Input Name    | Value         
| ------------- |:-------------|
| Description   | Facebook Event   |
| Regex         | facebook.com/events/      |
| Resolver URL  | http://localhost:9145/resolver      |


### TODOs

* Make responsive (currently not optimized for mobile)
* Authenticate email sender/recipient with Facebook to add:
	* private events
	* ability for user to accept event invite
	* see friends that are attending

