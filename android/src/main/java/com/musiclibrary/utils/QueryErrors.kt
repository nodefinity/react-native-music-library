package com.musiclibrary.utils

import com.facebook.react.bridge.Promise

internal interface CodedQueryException {
  val code: String
}

internal fun Promise.rejectQueryError(error: Exception, fallbackMessage: String) {
  if (error is CodedQueryException) {
    reject(error.code, error.message, error)
    return
  }

  reject("QUERY_ERROR", "$fallbackMessage: ${error.message}", error)
}
