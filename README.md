This application is built using [Nest](https://github.com/nestjs/nest) framework.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

PCRS-hint-service is a hint generator API for PCRS that uses [openAI](https://openai.com/api/). 

## Installation
1. Clone the repository
```sh
$ git clone https://github.com/huonggiangbui/pcrs-hint-services.git
```
2. Install dependencies
```sh
$ npm run build
```

## Running the App
1. Request and add a `.env `file to the root of the project directory.

2. Run the server.
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# API Endpoint Documentation
## **Hint Controllers**
- The following API controllers are implemented in `src/controller/hint.controller.ts`
### **POST /api/hints/:language/:pk**
``` typescript
@Post('hints/:language/:pk')
```
- Requesting a hint.
- Note: `prevHint` is an optional parameter.

Example body:
``` yaml
{
  submission: "",
  uid: "1",
  prevHint: 0,
}
```
Success response:
```yaml
{
  "type": "",
  "prompt": "",
  "hint": "",
  "submission": "",
  "config": 
    {
      "title": "",
      "description": null,
      "level": 1,
      "more": true,
      "feedback": false
    },
  "__problem__": 
    {
      "id": 1,
      "pk": "1",
      "language": "sql",
      "name": "",
      "description": "",
      "solution": "",
      "starter_code": "",
      "__students__": [
        {
        "id": 1,
        "uid": "1",
        "condition": "",
        "btnText": ""
        },
      ],
      "__has_students__": true
    },
    "__has_problem__": true,
    "__has_student__": true,
    "feedback": null,
    "id": 1}
```

### **GET api/config/:language/:pk**
```typescript
 @Post('feedback/:id')
```

- Requesting the specified api configuration for a specific question.

Example body:
```yaml
{
  uid: 1
}
```
Success response:
```yaml
{
    "condition": "control",
    "btnText": "Get Hint"
}
```

### **POST api/feedback/:id**
```typescript
  @Post('feedback/:id')
```
- Submitting a hint feedback

Example body:
```yaml
{
    feedback: ""
}
```

Success response
```yaml
{
    "message": "Feedback received",
    "showTextFeedback": false
}
```

### **POST api/logging/:id**
```typescript
  @Post('logging/:id')
```
- Logs user action
- There are 4 valid `action`:
  - `'request'` = requesting hint action,
  - `'follow-up'` = requesting a follow up hint action,
  - `'close'` = closing the hint modal,
  - `'expand'` = expanding the hint modal,

Example body:
```yaml
{
  action: "request"
}
```

Success response
```yaml
{
    "timestamp": "",
    "action": "request",
    "__hint__": {
        "id": 1,
        "type": "",
        "prompt": "",
        "hint": "",
        "submission": "",
        "feedback": "",
        "config": {
            "title": "",
            "description": "",
            "level": 1,
            "more": false,
            "feedback": true
        },
        "__student__": {
            "id": 1,
            "uid": "1",
            "condition": "control",
            "btnText": "Get hint"
        },
        "__has_student__": true
    },
    "__has_hint__": true,
    "__student__": {
        "id": 1,
        "uid": "2",
        "condition": "control",
        "btnText": "Get hint"
    },
    "__has_student__": true,
    "id": 1
}
```

## **Problem Controllers**
- The following API controllers are implemented in ```src/controller/problem.controller.ts```
### **POST api/problems/:language**
``` typescript
  @Post('problems/:language')
```
- Saves problems data.

Example body:
```yaml
{
  name: '',
  description: '',
  pk: '1',
  starter_code: '',
  solution: ''
}
```

Success response
```yaml
{
  "pk": "1",
  "language": "",
  "name": "",
  "description": "",
  "solution": "",
  "starter_code": "",
  "id": 1
}
```

### **PUT api/problems/:language/:pk**
``` typescript
  @Put('problems/:language/:pk')
```
- Updates an existing problem data.

Example body:
```yaml
{
  name: '',
  description: '',
  starter_code: '',
  solution: ''
}
```

Success response
```yaml
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```

### **DELETE api/problem/:language/:pk**
``` typescript
  @Delete('problems/:language/:pk')
```
- Deletes problem by pk

Example body:
```yaml
{}
```

Success response
```yaml
{
  "raw": [],
  "affected": 1
}
```
