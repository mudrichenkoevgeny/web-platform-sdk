import {
  appResultFailure,
  appResultSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageError } from '../error/model/storage-error'

/**
 * Interface for executing direct binary file uploads to remote storage via presigned URL.
 */
export interface DirectFileUploader {
  /**
   * Uploads a file directly to storage via presigned URL using XMLHttpRequest.
   *
   * @param uploadUrl - Presigned upload URL
   * @param file - Binary file to upload
   * @param onProgress - Optional callback tracking progress percentage (0-100)
   * @returns Promise resolving to AppResult with void on success or StorageError on failure
   */
  uploadFile(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<AppResult<void, StorageError>>
}

/**
 * Default XMLHttpRequest-backed implementation of {@link DirectFileUploader}.
 */
export class DirectFileUploaderImpl implements DirectFileUploader {
  /**
   * Uploads a binary file directly to a presigned URL.
   *
   * @param uploadUrl - Presigned upload URL
   * @param file - Binary file to upload
   * @param onProgress - Optional callback tracking progress percentage (0-100)
   * @returns Promise resolving to AppResult with void on success or StorageError on failure
   */
  public async uploadFile(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<AppResult<void, StorageError>> {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()

      xhr.open('PUT', uploadUrl, true)

      const mimeType = file.type || 'application/octet-stream'
      xhr.setRequestHeader('Content-Type', mimeType)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total)
          onProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(appResultSuccess(undefined))
        } else {
          resolve(
            appResultFailure(
              StorageError.s3UploadFailed(`Direct upload failed with status ${xhr.status}`)
            )
          )
        }
      }

      xhr.onerror = () => {
        resolve(
          appResultFailure(
            StorageError.s3UploadFailed('Network error or CORS failure during direct upload')
          )
        )
      }

      xhr.send(file)
    })
  }
}

/**
 * Standalone helper function for uploading a binary file directly to a presigned URL.
 *
 * @param uploadUrl - Presigned upload URL
 * @param file - Binary file to upload
 * @param onProgress - Optional callback tracking progress percentage (0-100)
 * @returns Promise resolving to AppResult with void on success or StorageError on failure
 */
export async function uploadFileDirectly(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<AppResult<void, StorageError>> {
  const uploader = new DirectFileUploaderImpl()
  return uploader.uploadFile(uploadUrl, file, onProgress)
}
