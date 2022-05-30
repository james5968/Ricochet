# Ricochet


https://user-images.githubusercontent.com/2874380/171059717-357364fe-4648-427c-a20e-f9af81c562d2.mov


## Prerequisites

- [Node.js > 16](https://nodejs.org) and npm (Recommended: Use [nvm](https://github.com/nvm-sh/nvm))
- [Watchman](https://facebook.github.io/watchman)
- [Xcode 13](https://developer.apple.com/xcode)
- [Cocoapods 1.11.2](https://cocoapods.org)
- [JDK > 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio and Android SDK](https://developer.android.com/studio)

## Base dependencies

- [jest](https://facebook.github.io/jest/) and [react-native-testing-library](https://callstack.github.io/react-native-testing-library/) for testing.

## Usage

### Post Env Setup

- Go to the project's root folder and run `yarn`.
- If you are using Xcode 13 or higher execute `yarn ios:prepare` to install pod dependencies
- Run `yarn ios` or `yarn android` to start your application!

Note: Please read the Setup environments section that is below in this file for more information about the execution scripts.

## Folder structure

This template follows a very simple project structure:

- `root`: This folder is the main container of all the code inside your application.
  - `src`: This is the root folder for all other TS code for the application, folder structure here to follow
  - `App.tsx`: Main component that starts your whole app.
  - `index.js`: Entry point of your application as per React-Native standards.

## Setup environments

### Using scripts from console

The template already has scripts to execute the project calling a specific environment defined into the package.json file. Keep in mind that if you are going to create new `envs` you have to define the script to build the project properly.

To define which env you want to use, just keep the structure `yarn [platform]: [environment]`

DEV: `yarn ios` or `yarn android`

STG: `yarn ios:staging` or `yarn android:staging`

PROD: `yarn ios:prod` o `yarn android:prod`

Also, you can use npm following the same rule as before: `npm run ios:staging`

Modify the environment variables files in root folder (`.env.development`, `.env.production` and `.env.staging`)
