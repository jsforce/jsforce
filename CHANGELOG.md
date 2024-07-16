## [3.2.3](https://github.com/jsforce/jsforce/compare/3.2.2...3.2.3) (2024-07-15)


### Bug Fixes

* add missing data to errors ([8dc3ac9](https://github.com/jsforce/jsforce/commit/8dc3ac955921f3d96496abd6385abdac59553f15))
* handle multiple errors ([84e80ad](https://github.com/jsforce/jsforce/commit/84e80adbc3533500495e18b193e42ce087d8358c))
* **oauth2:** ensure endpoints are valid ([#1525](https://github.com/jsforce/jsforce/issues/1525)) ([61e3623](https://github.com/jsforce/jsforce/commit/61e3623d0693b2911bca6d639585bad2a8f99338))
* use error.data ([d87ad8c](https://github.com/jsforce/jsforce/commit/d87ad8cde4fb3fe138ddff99bfdb285ce6034da9))



## [3.2.2](https://github.com/jsforce/jsforce/compare/3.2.1...3.2.2) (2024-06-28)


### Bug Fixes

* Remove redirectUri checking in OAuth2 Username-Password Flow ([#1419](https://github.com/jsforce/jsforce/issues/1419)) ([0184e21](https://github.com/jsforce/jsforce/commit/0184e2113962ec9f3193a9a8b41db3ccdfcd44a7))
* retry on 420 responses ([#1520](https://github.com/jsforce/jsforce/issues/1520)) ([214dffa](https://github.com/jsforce/jsforce/commit/214dffa53ab12e4911634b04774cc60c60a87486))
* **session-refresh:** improve error message ([7b0a2a4](https://github.com/jsforce/jsforce/commit/7b0a2a4de1dabc47d906f4bb3366fd19b97b0af7))



## [3.2.1](https://github.com/jsforce/jsforce/compare/3.2.0...3.2.1) (2024-06-24)


### Bug Fixes

* `jsforce.VERSION` matches current version ([#1507](https://github.com/jsforce/jsforce/issues/1507)) ([2621d0b](https://github.com/jsforce/jsforce/commit/2621d0b863487056ce25f949ad8d007125ed04b7))
* **bulk2:** always pass bodyParams to jobCreate ([8e63fd0](https://github.com/jsforce/jsforce/commit/8e63fd024c8afe6cf6c2f721072727b91c94aee9))
* **bulk:** add missing `created` field ([#1454](https://github.com/jsforce/jsforce/issues/1454)) ([b661afd](https://github.com/jsforce/jsforce/commit/b661afdd21729812974f1056e392f2f58fc21096))
* **bulk:** stop polling if job was aborted ([a8cb374](https://github.com/jsforce/jsforce/commit/a8cb374210aaa51ea3cd98e9b9c7675148e351ac))
* **conn:** validate `instanceUrl` is not a lightning URL ([#1418](https://github.com/jsforce/jsforce/issues/1418)) ([c41676d](https://github.com/jsforce/jsforce/commit/c41676dca047a9b48911b989cce6ae1011a82316))
* emit erro ([0ba3b67](https://github.com/jsforce/jsforce/commit/0ba3b677015c803c4a85749b78f1875c71931e3c))
* ensure query stops after reaching max records ([11fb447](https://github.com/jsforce/jsforce/commit/11fb4474e232551f1ce9ee28d940d7c88face8d7))
* **login:** throw if password expired ([#1517](https://github.com/jsforce/jsforce/issues/1517)) ([c7a35a5](https://github.com/jsforce/jsforce/commit/c7a35a55bf82fa6c7a5ee027f57a15eed8ad1dd2))
* re-enable linux/nuts tests ([8c3d6aa](https://github.com/jsforce/jsforce/commit/8c3d6aa7430bd96bb78bc8933e02e06ed0c0b5e1))
* remove dist dirs, pre-commit build step ([#1421](https://github.com/jsforce/jsforce/issues/1421)) ([52aeb9a](https://github.com/jsforce/jsforce/commit/52aeb9a935b8495edbf432efb2b0c1df3b365f30))



# [3.2.0](https://github.com/jsforce/jsforce/compare/3.1.0...3.2.0) (2024-04-23)


### Bug Fixes

* ensure it throws on bad status code ([50d1e8a](https://github.com/jsforce/jsforce/commit/50d1e8a147f9993077564ce531f8df4a4fe9f511))
* implement minTimeout ([33a2e58](https://github.com/jsforce/jsforce/commit/33a2e582cedf2720f0cfc114752280b838275a44))


### Features

* retry on statusCodes ([4010b8c](https://github.com/jsforce/jsforce/commit/4010b8ceb1d651fe482d44d291da148ec70a6917))



# [3.1.0](https://github.com/jsforce/jsforce/compare/3.0.0-next.3...3.1.0) (2024-04-09)


### Features

* remove deprecated jwt class ([#1406](https://github.com/jsforce/jsforce/issues/1406)) ([a4fd725](https://github.com/jsforce/jsforce/commit/a4fd7259e52af2f9ec35968f8793349a042eed6b))



