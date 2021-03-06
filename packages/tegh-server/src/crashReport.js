// import fs from 'fs'
// import path from 'path'
// import domain from 'domain'
// import _ from 'lodash'
// // import Raven from "raven"
//
// export const loadCrashReport = (errorDir) => {
//   const fileName = _.max(fs.readdirSync(errorDir))
//   if (fileName == null) return null
//   const fullPath = path.join(errorDir, fileName)
//   const json = JSON.parse(fs.readFileSync(fullPath))
//   if (json.seen) return null
//   json.seen = true
//   fs.writeFileSync(fullPath, JSON.stringify(json, null, 2))
//   return json
// }
//
// export const onUncaughtException = handlerConfig => (err) => {
//   // if (alreadyCrashing) throw err
//   // alreadyCrashing = true
//   const {
//     store,
//     errorDir,
//   } = handlerConfig
//   const date = new Date()
//   const crashReport = {
//     date: date.toUTCString(),
//     source: 'server',
//     level: 'fatal',
//     message: err.message,
//     stack: err.stack,
//     state: store == null ? null : {
//       ...store.getState(),
//       log: '[REDACTED]',
//       spool: '[REDACTED]',
//     },
//     // ravenContext: getRavenContext(),
//     seen: false,
//   }
//   // uninstallRaven()
//   fs.writeFileSync(
//     path.join(errorDir, `tegh_crash_report_${date.getTime()}.json`),
//     JSON.stringify(crashReport, null, 2),
//     {
//       mode: 0o660,
//     },
//   )
//   throw err
// }
//
//
// export const wrapInCrashReporting = ({ config, configPath }, cb) => {
//   /*
//    * Load the previous crash crash report
//    */
//   const errorDir = config.crashReports.directory
//   if (!fs.existsSync(errorDir)) {
//     throw new Error(`crash reports directory (${errorDir}) does not exist`)
//   }
//   const crashReport = loadCrashReport(errorDir)
//   /*
//    * Upload fatal errors to Sentry via raven after the service is restarted
//    */
//   // if (config.crashReports.uploadCrashReportsToDevs) {
//   //   // Raven.disableConsoleAlerts()
//   //   Raven
//   //     .config(RAVEN_DSN, { captureUnhandledRejections: false })
//   //     .install((e) => { console.error(e) })
//   //   if (crashReport != null) {
//   //     /*
//   //      * Recreate the error and raven context from the crashReport so it
//   //      * can be uploaded. Raven is reset aftwards.
//   //      */
//   //     const syntheticError = new Error(crashReport.message)
//   //     syntheticError.stack = crashReport.stack
//   //     Raven._globalContext = crashReport.ravenContext
//   //     Raven.captureException(syntheticError)
//   //     Raven._globalContext = {}
//   //   }
//   // }
//   /*
//    * Treat unhandledRejections from promises the same as uncaught exceptions
//    */
//   process.on('unhandledRejection', (e) => {
//     throw e
//   })
//   /*
//    * Run the callback inside a domain that will capture its fatal errors in
//    * crash report logs.
//    */
//   const wrapperDomain = domain.create()
//   const handlerConfig = { errorDir }
//   const setErrorHandlerStore = store => handlerConfig.store = store
//   const errorHandler = onUncaughtException(handlerConfig)
//   wrapperDomain.on('error', errorHandler)
//   wrapperDomain.run(() => cb({
//     crashReport,
//     errorHandler,
//     setErrorHandlerStore,
//   }))
// }
