import {
  appResultFailure,
  appResultSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageError } from '@/error/model/storage-error'

/**
 * Manager interface for executing direct binary file uploads to S3 storage.
 */
export interface S3DirectUploadManager {
  /**
   * Uploads a file directly to S3 via presigned URL using XMLHttpRequest.
   *
   * @param uploadUrl - Presigned S3 upload URL
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
 * Default XMLHttpRequest-backed implementation of {@link S3DirectUploadManager}.
 */
export class S3DirectUploadManagerImpl implements S3DirectUploadManager {
  /**
   * Uploads a binary file directly to an S3-compatible storage using a presigned URL.
   *
   * @param uploadUrl - Presigned S3 upload URL
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
              StorageError.s3UploadFailed(`S3 upload failed with status ${xhr.status}`)
            )
          )
        }
      }

      xhr.onerror = () => {
        resolve(
          appResultFailure(
            StorageError.s3UploadFailed('Network error or CORS failure during S3 upload')
          )
        )
      }

      xhr.send(file)
    })
  }
}

/**
 * Standalone helper function delegating to {@link S3DirectUploadManagerImpl} for backwards compatibility.
 *
 * @param uploadUrl - Presigned S3 upload URL
 * @param file - Binary file to upload
 * @param onProgress - Optional callback tracking progress percentage (0-100)
 * @returns Promise resolving to AppResult with void on success or StorageError on failure
 */
export async function uploadFileToS3(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<AppResult<void, StorageError>> {
  const manager = new S3DirectUploadManagerImpl()
  return manager.uploadFile(uploadUrl, file, onProgress)
}
