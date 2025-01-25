import { Client, Storage, ID, Query } from "appwrite";
import conf from '../conf/conf.js';

export class StorageService {
    client = new Client();
    bucket;

    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)

        this.bucket  = new Storage(this.client)
    } 


    // File Upload Service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile:: error", error);
            return false
        }
    }

    // File delete service
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile:: error", error);
            return false;
        }
    }

    // Get the File View Service
    getFile(fileId) {
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId,
        )
    }
}

const storageService = new StorageService();
export default storageService;