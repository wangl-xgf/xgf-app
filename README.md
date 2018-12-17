# xgf-app

## docker deploy (build and run in containers)
```
docker build -t xgf-app
```
```
docker run -p 4200:80 xgf-app
```
## develop run (require ionic,cordova)
```
npm start
```
## package android apk (require ionic,cordova)

```
npm run android:build
```
(./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk)

## emulate android (require ionic,cordova)

```
ionic cordova emulate android
```

## emulate ios(require Mac,ionic,cordova)

```
ionic cordova emulate ios
```

## package ios app (require Mac)
```
npm run ios:build
```
test
