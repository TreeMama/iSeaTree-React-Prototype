/* This code is exporting two constants `envVariables` and `CONFIG`. `envVariables` is an object
containing Firebase configuration variables such as `APP_ID`, `API_KEY`, `AUTH_DOMAIN`,
`DATABASE_URL`, `STORAGE_BUCKET`, and `PROJECT_ID`. `CONFIG` is also an object containing various
configuration variables such as `ITREE_KEY`, `API_TREE_BENEFIT`, `NATION`, `STATE`, `COUNTYNAME`,
`CITYNAME`, and `AWS_S3_URL`. These constants can be imported and used in other parts of the
codebase. */

export const envVariables = {
  FIREBASE: {
    APP_ID: '',
    API_KEY: '',
    AUTH_DOMAIN: '',
    DATABASE_URL: '',
    STORAGE_BUCKET: '',
    PROJECT_ID: '',
  },
}
export const CONFIG = {
  ITREE_KEY: '',
  API_TREE_BENEFIT: '',
  NATION: '',
  STATE: '',
  COUNTYNAME: '',
  CITYNAME: '',
  AWS_S3_URL: '',
}
