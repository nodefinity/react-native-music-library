package com.musiclibrary.tracks

import android.os.Build
import android.provider.DocumentsContract
import android.provider.MediaStore
import androidx.core.net.toUri
import com.musiclibrary.utils.CodedQueryException

internal data class TrackDirectorySelection(
  val clause: String? = null,
  val arguments: List<String> = emptyList(),
)

internal data class ExternalStorageDirectory(
  val volumeName: String,
  val relativePathPrefix: String?,
)

internal class UnsupportedDirectoryUriException(directory: String) : IllegalArgumentException(
  "Directory URI is not a supported MediaStore-backed external storage tree: $directory",
), CodedQueryException {
  override val code = "UNSUPPORTED_DIRECTORY_URI"
}

internal object TrackDirectoryFilter {
  fun resolve(directory: String?): TrackDirectorySelection {
    if (directory.isNullOrEmpty()) {
      return TrackDirectorySelection()
    }

    if (!directory.startsWith("content://", ignoreCase = true)) {
      return TrackDirectorySelection(
        clause = "${MediaStore.Audio.Media.DATA} LIKE ?",
        arguments = listOf("$directory%"),
      )
    }

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      throw UnsupportedDirectoryUriException(directory)
    }

    val uri = directory.toUri()
    if (
      uri.authority != EXTERNAL_STORAGE_AUTHORITY ||
      !DocumentsContract.isTreeUri(uri)
    ) {
      throw UnsupportedDirectoryUriException(directory)
    }

    val documentId = try {
      DocumentsContract.getTreeDocumentId(uri)
    } catch (_: IllegalArgumentException) {
      throw UnsupportedDirectoryUriException(directory)
    }
    val parsed = parseExternalStorageDocumentId(documentId)
      ?: throw UnsupportedDirectoryUriException(directory)

    val relativePathPrefix = parsed.relativePathPrefix
    return if (relativePathPrefix == null) {
      TrackDirectorySelection(
        clause = "${MediaStore.MediaColumns.VOLUME_NAME} = ?",
        arguments = listOf(parsed.volumeName),
      )
    } else {
      TrackDirectorySelection(
        clause = "${MediaStore.MediaColumns.VOLUME_NAME} = ? AND ${MediaStore.MediaColumns.RELATIVE_PATH} LIKE ?",
        arguments = listOf(parsed.volumeName, relativePathPrefix),
      )
    }
  }

  internal fun parseExternalStorageDocumentId(documentId: String): ExternalStorageDirectory? {
    val parts = documentId.split(":", limit = 2)
    if (parts.isEmpty() || parts[0].isBlank()) {
      return null
    }

    val volumeName = if (parts[0].equals("primary", ignoreCase = true)) {
      MediaStore.VOLUME_EXTERNAL_PRIMARY
    } else {
      parts[0].lowercase()
    }
    val relativePath = parts.getOrNull(1)?.trim('/')?.takeIf { it.isNotEmpty() }
    val prefix = relativePath?.let { "$it/%" }

    return ExternalStorageDirectory(volumeName, prefix)
  }

  private const val EXTERNAL_STORAGE_AUTHORITY = "com.android.externalstorage.documents"
}
